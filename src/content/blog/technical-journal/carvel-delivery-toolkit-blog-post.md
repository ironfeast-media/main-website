---
title: "The Carvel Delivery Toolkit: Why This CNCF Project Deserves More Attention"
date: "2025-02-05"
category: "Platform Engineering"
type: technical-journal
tags:
  - carvel
  - kubernetes
  - platform-delivery
  - ytt
  - kapp
  - imgpkg
  - kbld
  - cncf
summary: "A lead developer's perspective on the design philosophy that makes Carvel the professional choice for Kubernetes software delivery."
author: João Pereira | Principal Investigator
company: Ironfeast Labs
estimated-reading-time: 13 minutes
images:
  carvel-workflow-diagram: './carvel-toolkit-workflow.png'
  imgpkg-airgap-relocation: './imgpkg-airgap-relocation.png'
---

# The Carvel Delivery Toolkit: Why This CNCF Project Deserves More Attention

*A lead developer's perspective on the design philosophy that makes Carvel the professional choice for Kubernetes software delivery*

---

After years of implementing packaging and installation solutions for Tanzu Kubernetes, and as someone who's contributed to Carvel's development, I've seen firsthand what separates toy tooling from production-grade delivery systems. The Carvel toolkit isn't just another collection of Kubernetes utilities—it represents a fundamental rethinking of how software should be delivered to platforms.

Now a CNCF Incubating project with neutral governance, Carvel originated from VMware's Pivotal acquisition but has evolved into a vendor-neutral standard for platform delivery. While it powers VMware Tanzu, it works equally well on EKS, GKE, AKS, or vanilla Kubernetes. This isn't vendor lock-in tooling—it's the right primitives for any serious platform team.

Most people encounter Carvel tools individually: kapp for deployments, ytt for templating, imgpkg for bundling, kbld for image management. But that's like seeing individual instruments without recognizing the orchestra. The real genius is in how these tools form a cohesive system designed around core principles that most Kubernetes tooling gets wrong.

## The Problem Space: Why Kubernetes Delivery Is Hard

Before diving into Carvel's philosophy, let's establish why we need specialized tooling at all. Kubernetes gave us a declarative API for infrastructure, but it conspicuously left out critical pieces for software delivery:

**Configuration management at scale** - YAML sprawl becomes unmaintainable fast. Simple string substitution doesn't cut it when you need conditional logic, data transformations, and composition across environments.

**Reliable state convergence** - `kubectl apply` has surprising edge cases. Deleted fields don't disappear, resource ordering isn't guaranteed, and understanding what changed between deployments requires manual diffing.

**Air-gapped distribution** - Enterprise reality means moving software across network boundaries. Container images are just one piece—you need configs, operators, CRDs, and their dependencies bundled together with cryptographic integrity.

**Dependency resolution** - Real platforms aren't monolithic. You have layered components with version constraints, and "just use Helm" becomes untenable when you're managing 50+ interdependent charts.

The Kubernetes ecosystem responded with partial solutions. Helm tackled templating but introduced runtime templating complexity and tiller. Kustomize solved layering but couldn't handle real logic. GitOps tools like Flux and Argo addressed continuous delivery but assumed you'd solved packaging already.

## The Carvel Philosophy: Composable Unix-Style Tools

What the Carvel project got right—first at VMware, now under CNCF stewardship—was rejecting the "one tool to rule them all" approach. Instead, each tool was designed to do one thing exceptionally well, with clean interfaces between them. This is why Carvel feels different—it's not trying to be your entire delivery platform. It's giving you the right primitives.

![Diagram of workflow for Carvel tools]{img:carvel-workflow-diagram}

### ytt: Configuration as Code, Not Templates

Every templating system for Kubernetes starts with string substitution and evolves into a programming language. Helm invented its own template syntax. Kustomize avoided templating altogether but hit the limits of strategic merge patches. ytt acknowledged the reality: configuration at scale requires real programming constructs.

But here's the crucial difference—ytt treats YAML as structured data, not strings. When you write ytt templates, you're manipulating the data model directly:

```yaml
#@ load("@ytt:data", "data")
#@ load("@ytt:overlay", "overlay")

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  replicas: #@ str(data.values.replicas)
  #@ if/end data.values.enableFeatureX:
  feature_x_endpoint: #@ data.values.features.x.endpoint
```

This isn't string templating dressed up—it's a real programming language (Starlark) with YAML-aware syntax. You get proper functions, conditionals, loops, and most importantly, validation. The YAML structure is preserved, which means errors show you actual YAML paths, not mysterious template expansion failures.

One important nuance: ytt overlays are order-dependent. This gives you precise control over how transformations compose (later overlays can modify earlier ones), but it's a more complex mental model than Kustomize's simpler strategic merge patches. The tradeoff is intentional—ytt optimizes for power and expressiveness over simplicity, which makes it the right choice for platform teams managing complex configurations but potentially steeper learning curve for simpler use cases.

In production Tanzu deployments, we've used ytt to manage configurations across hundreds of microservices with environment-specific overrides, feature flags, and compliance overlays. The fact that ytt separates data values from logic means your configuration can be audited, versioned, and validated independently from the templates that consume them.

### kapp: Convergent Deployment That Actually Works

If you've ever run `kubectl apply` and wondered why deleted fields persisted, or watched resources fail to clean up properly, you've hit the limits of basic declarative application. kapp reimagines this completely.

The core insight: deployment isn't just pushing YAML to the API server. It's about understanding application topology, managing resource lifecycle, and providing observable convergence.

```bash
kapp deploy -a my-app -f config/ --diff-changes
```

This simple command does something remarkable:
1. Builds a dependency graph of your resources
2. Shows you exactly what will change (real diffs, not kubectl's cryptic field-manager conflicts)
3. Deploys in the correct order (namespaces before deployments, CRDs before custom resources)
4. Waits for resources to become ready before proceeding
5. Tracks everything as a named application that can be inspected or deleted atomically

The diff engine is where kapp shines for platform teams. You see the actual changes that will be applied, formatted in a way that makes sense. When you're shipping a platform update to production, this visibility is non-negotiable.

But here's what sealed it for us in Tanzu: kapp's change rules and rebase rules. You can define how conflicts should be resolved, which fields are safe to override, and how to handle operator-managed resources. This turns kapp from a deployment tool into a contract between your delivery pipeline and the cluster state.

### imgpkg: Bundles as the Distribution Primitive

Container registries solved image distribution, but platforms aren't just images. You have manifests, operators, configuration schemas, RBAC policies, and increasingly, attestations and SBOMs. How do you move all of that as a unit?

imgpkg introduces the concept of bundles—OCI artifacts that contain everything needed to install a piece of software. Not just the images, but the complete declarative specification.

```yaml
apiVersion: imgpkg.carvel.dev/v1alpha1
kind: Bundle
metadata:
  name: my-platform-component
spec:
  image: registry.example.com/platform/component@sha256:abc123
```

A bundle is itself an OCI image, which means it gets all the benefits of container registries: authentication, replication, scanning, signing. But it can contain nested images (via ImageLock files) and arbitrary content.

This becomes critical for air-gapped scenarios. With imgpkg, you can:

```bash
# Pull entire bundle with all nested images
imgpkg copy -b registry.example.com/platform/postgres:1.2.3 \
  --to-tar /tmp/postgres-bundle.tar

# Push to air-gapped registry
imgpkg copy --tar /tmp/postgres-bundle.tar \
  --to-repo airgap-registry.local/platform/postgres \
  --registry-ca-cert-path /path/to/ca.crt
```

The entire dependency tree—images, configs, operators—relocates atomically with integrity preserved. This isn't theoretical; this is how thousands of Tanzu installations happen in regulated industries where internet access is a fantasy.

![imgpkg Relocation Process Diagram]{img:imgpkg-airgap-relocation}

### kbld: Image Immutability and Lock Files

One of the most overlooked supply chain risks is mutable image tags. `my-app:latest` means different things over time. Even semantic versioned tags can be overwritten. kbld solves this by rewriting your Kubernetes configs to use immutable digest references.

```yaml
# Before kbld
image: nginx:1.21

# After kbld
image: nginx@sha256:5e5a5e5a5e5a5e5a5e5a5e5a5e5a5e5a5e5a5e5a5e5a5e5a5e5a5e5a5e5a5e5a
```

But it goes further. kbld can delegate to build images as part of your deployment workflow, integrate with Docker, Bazel, and, pack/buildpacks for the build portion of your deployment, and most importantly, generate lock files that capture the exact image digests used in a deployment.

This creates an audit trail. You know precisely which image SHAs ran in production, which is table stakes for SLSA compliance and incident response.

### kapp-controller: Reconciliation at the Package Level

While the four tools above work great in CI/CD pipelines, kapp-controller brings Carvel's philosophy into the cluster itself. It's a Kubernetes operator that reconciles Package and PackageInstall custom resources.

This is where Carvel becomes a complete platform delivery system. You can define a catalog of available software (PackageRepository), let platform users discover what's available, and install packages declaratively with version constraints and configuration overrides.

```yaml
apiVersion: packaging.carvel.dev/v1alpha1
kind: PackageInstall
metadata:
  name: postgres-operator
spec:
  serviceAccountName: postgres-install-sa
  packageRef:
    refName: postgres.example.com
    versionSelection:
      constraints: ">=1.2.0 <2.0.0"
  values:
  - secretRef:
      name: postgres-values
```

kapp-controller watches this resource, fetches the appropriate package version from the repository, overlays your configuration values using ytt, and deploys it using kapp's reconciliation engine. It's GitOps-compatible but doesn't require you to commit rendered manifests.

For Tanzu Application Platform, this architecture enabled a plugin model where platform teams curate a catalog, and development teams self-service installation without needing cluster admin rights. The separation of concerns is clean.

## A Concrete Example: The Full Toolkit in Action

Let me walk through a real-world scenario that demonstrates why each piece matters. Say you're delivering a multi-component platform—a PostgreSQL operator with monitoring, backup tooling, and connection pooling. Here's how Carvel handles this end-to-end.

### Step 1: Configuration with ytt

You start with base manifests for your PostgreSQL operator, but you need environment-specific configuration—different resource limits for dev vs prod, compliance overlays for regulated environments, and custom backup schedules.

Your ytt structure looks like:

```
postgres-platform/
├── config/
│   ├── operator.yml          # Base operator deployment
│   ├── rbac.yml              # Service accounts and roles
│   ├── monitoring.yml        # Prometheus ServiceMonitor
│   └── schema.yml            # PostgresCluster CRD
├── values-schema.yml         # Validates data values
└── overlays/
    ├── prod-resources.yml    # Production resource limits
    └── compliance.yml        # Audit logging, encryption
```

Your `values-schema.yml` defines the contract:

```yaml
#@data/values-schema
---
environment: "dev"  #! dev, staging, prod
replicas: 3
resources:
  cpu: "500m"
  memory: "1Gi"
compliance:
  auditLogging: false
  encryptionAtRest: false
```

Then in your CI pipeline or local development, you render with environment-specific values:

```bash
ytt -f config/ -f overlays/ \
  --data-value environment=prod \
  --data-value replicas=5 \
  --data-value resources.cpu=2000m \
  --data-value compliance.auditLogging=true \
  > rendered-manifests.yml
```

What makes this powerful: the schema validates inputs, the overlays are composable (you can layer compliance on top of environment-specific configs), and the output is pure Kubernetes YAML that you can inspect, test, or store.

### Step 2: Image Immutability with kbld

Your rendered manifests reference images with tags:

```yaml
image: postgres-operator:v1.5.2
image: monitoring-sidecar:latest
image: backup-agent:stable
```

These are mutable. Tags can be overwritten, `latest` is a moving target, and you have zero audit trail. Run kbld:

```bash
kbld -f rendered-manifests.yml \
  --imgpkg-lock-output .imgpkg/images.yml \
  > manifests-with-digests.yml
```

Now your manifests reference immutable digests:

```yaml
image: postgres-operator@sha256:a1b2c3d4e5f6...
image: monitoring-sidecar@sha256:f6e5d4c3b2a1...
image: backup-agent@sha256:9876543210ab...
```

The `.imgpkg/images.yml` lock file captures exactly which image SHAs are in this release. This is your provenance document. If an incident happens in production, you know precisely which images were running. For SLSA compliance, this lock file is signed and becomes part of your attestation chain.

### Step 3: Bundle Creation with imgpkg

Now you have manifests with immutable image references. But how do you distribute this as a unit? How do you ensure the manifests and images travel together, especially across air-gaps?

Create an imgpkg bundle:

```bash
imgpkg push -b registry.example.com/platform/postgres-operator:1.5.2 \
  -f manifests-with-digests.yml \
  -f .imgpkg/images.yml
```

imgpkg analyzes the images.yml lock file, pulls all referenced images, and packages everything—manifests plus images—into a single OCI bundle artifact. The bundle itself is pushed to the registry with a digest reference.

When you need to relocate to an air-gapped environment:

```bash
# Export from internet-connected registry
imgpkg copy -b registry.example.com/platform/postgres-operator:1.5.2 \
  --to-tar postgres-bundle.tar

# Transfer to air-gapped environment (USB drive, secure transfer, etc.)

# Import to air-gapped registry
imgpkg copy --tar postgres-bundle.tar \
  --to-repo airgap.internal/platform/postgres-operator
```

imgpkg facilitates seamless relocation to air-gapped environments without ever altering your original manifests. When you use imgpkg copy, it ensures all referenced images are mirrored to the internal registry while preserving their original digest (SHA). When it's time to deploy, the imgpkg pull command dynamically generates a localized ImagesLock file on disk. This allows downstream tools like kbld or kapp to resolve image paths to the local registry while maintaining the exact same cryptographic integrity as the source. You get the benefits of relocation without the risk of manual sed commands or "magic" manifest rewriting.

### Step 4: Deployment with kapp

Finally, you deploy to the cluster:

```bash
imgpkg pull -b airgap.internal/platform/postgres-operator:1.5.2 -o postgres-operator
ytt -f postgres-operator/config | kbld -f postgres-operator/.imgpkg/images.yml -f - | kapp deploy \
  -a postgres-operator \
  --diff-changes \
  --wait-timeout 10m \
  -f -
```

kapp shows you a detailed diff of what will change in the cluster, waits for resources to become healthy (operator pod running, CRDs established, webhooks ready), and tracks the entire application as a named unit.

Later, when you need to understand what's deployed:

```bash
kapp inspect -a postgres-operator --tree
```

You see the full resource graph—deployments, replicasets, pods, services, CRDs—all tracked together. Need to clean up? `kapp delete -a postgres-operator` removes everything atomically.

### Step 5: GitOps Integration with kapp-controller

For ongoing reconciliation, you define a Package:

```yaml
apiVersion: data.packaging.carvel.dev/v1alpha1
kind: Package
metadata:
  name: postgres-operator.platform.example.com.1.5.2
spec:
  refName: postgres-operator.platform.example.com
  version: 1.5.2
  template:
    spec:
      fetch:
      - imgpkgBundle:
          image: airgap.internal/platform/postgres-operator:1.5.2
      template:
      - ytt:
          paths:
          - config/
      - kbld: {}
      deploy:
      - kapp: {}
```

Platform users install via PackageInstall:

```yaml
apiVersion: packaging.carvel.dev/v1alpha1
kind: PackageInstall
metadata:
  name: my-postgres
spec:
  packageRef:
    refName: postgres-operator.platform.example.com
    versionSelection:
      constraints: ">=1.5.0 <2.0.0"
  values:
  - secretRef:
      name: my-postgres-config
```

kapp-controller continuously reconciles this. If the bundle is updated, or if configuration changes, it re-runs the ytt→kbld→kapp pipeline automatically.

This complete workflow—configuration, immutability, bundling, deployment, reconciliation—is how we delivered Tanzu Application Platform components to hundreds of customer clusters. Each tool doing one thing well, composing into a robust delivery system.

## Why This Design Matters: Lessons from Production

Having implemented this toolkit across dozens of enterprise Tanzu deployments, certain patterns emerge that validate Carvel's design choices.

### Composability Enables Flexibility

Because each tool has a single responsibility with clear inputs and outputs, you can integrate them into existing workflows. You don't have to adopt "the Carvel way" wholesale.

Want to use ytt for templating but stick with Helm for deployment? Fine. Want kapp's deployment engine but generate config with Kustomize? Works perfectly. Need imgpkg bundles but build images with your existing CI? No problem.

This matters enormously in enterprises where you're not building greenfield. The Carvel tools meet you where you are.

### Transparency Builds Trust

Every Carvel tool is inspectable. ytt shows you exactly what YAML it generated. kapp shows you exactly what diffs it will apply. imgpkg shows you exactly what's in a bundle. There's no magic, no hidden state, no "trust the platform" moments.

When you're shipping updates to production Kubernetes clusters running critical workloads, this transparency is the difference between confident deployments and sweaty hands.

### Declarative All the Way Down

One of Helm's original sins was runtime templating. Your chart depends on cluster state or API calls during installation. This creates non-determinism and makes troubleshooting nightmarish.

Carvel enforces declarative transformation. ytt runs against static data values files. kapp deploys pre-rendered manifests. imgpkg bundles are immutable artifacts. This means you can test locally, in CI, and in production with confidence that you're deploying identical configurations.

### Air-Gap Is a First-Class Concern

Most Kubernetes tooling treats air-gapped deployment as an afterthought. Carvel designed for it from day one because VMware's enterprise customers demanded it.

The imgpkg relocation workflow isn't a hack, **it is the architecture**. Bundles contain lock files that track image references, making relocation deterministic and auditable. This is why we could reliably deploy 100+ component platforms into classified networks.

## Where Carvel Fits in Modern Delivery

The Kubernetes delivery landscape has evolved. GitOps is mainstream, platform engineering is a discipline, supply chain security is mandatory. So where does Carvel fit?

**For Platform Teams (Any Distribution)**: Carvel is the packaging layer between your CI builds and your GitOps reconciler, regardless of whether you're on EKS, GKE, AKS, or vanilla Kubernetes. Build with Nix or BuildKit, package with imgpkg, deploy with Flux/Argo watching PackageInstall resources. While Carvel powers VMware Tanzu, it's fully open-source and distribution-agnostic.

**For Enterprise Software Vendors**: If you ship software to customer Kubernetes clusters, especially air-gapped ones, imgpkg bundles are your distribution format. They're self-contained, relocatable, and compatible with every registry—no vendor lock-in, no distribution-specific assumptions.

**For Supply Chain Security**: The Carvel primitives map cleanly to SLSA requirements. imgpkg bundles can carry attestations alongside artifacts. kbld lock files provide build provenance. ytt's deterministic templating enables reproducible deployments.

**For Multi-Cluster Operations**: kapp-controller's package repositories can be synchronized across clusters, ensuring consistent software catalogs. This is how you maintain fleet-wide platform coherence whether you're managing a dozen EKS clusters or a hybrid multi-cloud footprint.

## What the Project Got Right (And the Challenges Ahead)

Credit where it's due—Carvel's design is exceptionally thoughtful. The Unix philosophy of composable tools, the focus on transparency, the air-gap support, the clean separation between build-time and deploy-time concerns. These are the right primitives for platform delivery, regardless of which Kubernetes distribution you're running.

The evolution from VMware internal tooling to CNCF Incubating project is significant. Neutral governance means the project serves the broader Kubernetes community, not just Tanzu. You can adopt Carvel on EKS, GKE, OpenShift, or bare-metal clusters without worrying about vendor entanglement. The tools are open-source, the community is vendor-neutral, and the roadmap is driven by real-world platform engineering needs.

But adoption has been slower than it deserves, and that's partly on communication. Carvel looks like "just more Kubernetes tools" until you understand the system design. The individual pieces are approachable; the cohesive vision requires explanation.

The other challenge is ecosystem gravity. Helm has massive adoption despite its flaws. GitOps tools have mindshare. CNCF politics matter—Carvel is Incubating, not yet Graduated, which affects perception even if it doesn't reflect maturity.

That said, I've watched Carvel gain traction in exactly the environments where it shines: large enterprises, regulated industries, multi-cluster platforms, air-gapped deployments. The teams who need serious delivery tooling find Carvel. The challenge is making everyone else realize they need it too.

## The Road Ahead: Carvel + Supply Chain Security

Where I see Carvel's future is at the intersection of delivery and supply chain security. SLSA frameworks talk about provenance, but they need concrete implementations. imgpkg bundles can carry cosign signatures and attestations. kbld lock files are provenance documents. kapp-controller can verify signatures before installation.

Combine this with hermetic build systems like Nix, and you have end-to-end supply chain assurance from source to runtime. Build deterministically, package with provenance, distribute with integrity, deploy with verification.

This is the evolution I'm betting on. Not Carvel as "VMware's Kubernetes tools," but Carvel as a CNCF-governed, vendor-neutral backbone of secure platform delivery. The primitives are there. The architecture is right. The community stewardship ensures it serves all Kubernetes distributions, not just one vendor's platform. It's time for the industry to catch up.

---

## Getting Started

If you're intrigued, start small:

1. **Try ytt** on a gnarly set of Helm values you're tired of maintaining. See how data transformations feel when you have real programming constructs.

2. **Use kapp** for your next production deployment. Watch the diff output and realize how much `kubectl apply` was hiding from you.

3. **Experiment with imgpkg** for bundling a multi-component application. Experience what it's like to distribute Kubernetes apps as coherent units.

4. **Explore kapp-controller** if you're building an internal platform. The package/repository model is how platforms should expose software catalogs.

The Carvel toolkit isn't for everyone. If you're deploying a single stateless app, Helm probably suffices. But if you're building platforms, delivering software to customer environments, operating at enterprise scale, or serious about supply chain security, Carvel is the professional choice.

The project got it right—from its origins at VMware to its current neutral governance under the CNCF. Whether you're on Tanzu, EKS, GKE, or bare-metal, these primitives work. Now it's on us to prove it in production.

---

The future of Kubernetes packaging isn't just about hermetic builds—it's about provable supply chain integrity from source to runtime. At Ironfeast, we're building tooling that bridges Carvel's delivery primitives with end-to-end SLSA compliance, because platforms need both the right packaging system and cryptographic proof that what you deployed is what you scanned. Follow along at [ironfeast.tv/blog](https://ironfeast.tv/blog) for deep-dives on Carvel, SLSA attestations, and the evolution of secure platform delivery.