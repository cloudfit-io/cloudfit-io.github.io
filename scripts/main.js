// ── copy install command ──
function copyInstall(btn) {
  navigator.clipboard.writeText('pip install cloudfit-core').then(() => {
    btn.textContent = 'copied!';
    setTimeout(() => btn.textContent = 'copy', 2000);
  });
}

// ── archetype explorer ──
const ARCHETYPES = [
  {
    tag: 'I/O bound', name: 'Disk-saturating workloads',
    body: 'Sequential read/write dominates wall-clock time. More CPU does not help; faster local SSD does. cloudfit weights the io archetype toward local SSD (against the requested scratch disk) alongside vCPU and RAM, so SSD-equipped instances score higher for these workloads.',
    tools: ['Sequencing demultiplexing', 'Short-read alignment', 'Long-read alignment'],
    vcpu: 60, ram: '224 GB', disk: '15 to 20 TB', spot: 'No (stateful I/O)',
  },
  {
    tag: 'CPU bound', name: 'Thread-parallel workloads',
    body: 'Computation saturates all available cores. Scales linearly with vCPU count up to a ceiling. Scoring fits effective capacity (vCPU × the family perf factor), so a faster family needs fewer cores to fit, and cost is scored per unit of work.',
    tools: ['Variant calling', 'De novo assembly', 'RNA-seq quantification'],
    vcpu: 32, ram: '64 to 512 GB', disk: '1 to 5 TB', spot: 'Depends on tool',
  },
  {
    tag: 'Memory bound', name: 'Large in-memory index workloads',
    body: 'The bottleneck is loading a reference database or contact matrix into RAM. Scoring applies a hard RAM floor: instances below the minimum are eliminated before any scoring occurs, and the mem archetype weights RAM fit most heavily.',
    tools: ['Metagenomics classification', 'Single-cell RNA-seq', 'Hi-C chromatin'],
    vcpu: 32, ram: '128 to 512 GB', disk: '2 to 6 TB', spot: 'Sometimes',
  },
  {
    tag: 'GPU / ML', name: 'GPU inference and training',
    body: 'Structure prediction, variant calling acceleration, and basecalling all saturate GPU compute. cloudfit filters by GPU presence and VRAM, then scores accelerator throughput, so an A100 outranks a T4 at equal VRAM. Split recommendations for multi-stage workloads (CPU MSA → GPU inference) are planned.',
    tools: ['Protein structure prediction', 'GPU variant calling', 'ONT basecalling'],
    vcpu: 8, ram: '32 to 64 GB', disk: '1 to 3 TB', spot: 'No (long-running)',
  },
  {
    tag: 'Burst parallel', name: 'Scatter-gather fleet workloads',
    body: 'Each task is an independent stateless container. The right recommendation is many small preemptible instances, not one large one. The burst archetype scores on spot prices by default; fleet recommendations (many small instances instead of one large node) are planned.',
    tools: ['Nextflow pipelines', 'Snakemake DAGs', 'WDL / Cromwell scatter'],
    vcpu: 4, ram: '16 to 32 GB', disk: '< 1 TB', spot: 'Yes (restart-tolerant)',
  },
];

function selectArch(i) {
  document.querySelectorAll('.arch-card').forEach((c, j) =>
    c.classList.toggle('active', i === j));
  const a = ARCHETYPES[i];
  document.getElementById('archDetail').innerHTML = `
    <div>
      <div class="arch-detail-title">${a.name}</div>
      <div class="arch-detail-body">${a.body}</div>
      <div class="arch-tools">
        ${a.tools.map(t => `<span class="tool-tag">${t}</span>`).join('')}
      </div>
    </div>
    <div>
      <div class="arch-detail-title">Typical resource profile</div>
      <div class="spec-row"><span class="spec-key">vCPU</span><span class="spec-val">${a.vcpu}</span></div>
      <div class="spec-row"><span class="spec-key">RAM</span><span class="spec-val">${a.ram}</span></div>
      <div class="spec-row"><span class="spec-key">Scratch disk</span><span class="spec-val">${a.disk}</span></div>
      <div class="spec-row"><span class="spec-key">Spot / preemptible</span><span class="spec-val">${a.spot}</span></div>
    </div>`;
}

selectArch(0);

// ── latest releases ──
// GitHub Releases are published automatically from each package's CHANGELOG,
// so the site reads them instead of keeping its own copy. On any failure
// (offline, rate limit) the static fallback in the HTML stays in place.
const RELEASE_REPOS = ['cloudfit-core', 'cloudfit-provider-gcp', 'cloudfit-api', 'cloudfit-ui'];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

RELEASE_REPOS.forEach(repo => {
  fetch(`https://api.github.com/repos/cloudfit-io/${repo}/releases/latest`)
    .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
    .then(rel => {
      const card = document.querySelector(`[data-release="${repo}"]`);
      if (!card) return;
      card.href = rel.html_url;
      card.querySelector('.eco-status').textContent = `● released ${formatDate(rel.published_at)}`;
      card.querySelector('.release-tag').textContent = rel.tag_name;
      if (repo === 'cloudfit-core') {
        document.getElementById('coreVersion').textContent =
          `Successfully installed cloudfit-core-${rel.tag_name.replace(/^v/, '')}`;
      }
    })
    .catch(() => {});
});
