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
    vcpu: 60, ram: '224 GB', disk: '15–20 TB', spot: 'No — stateful I/O',
  },
  {
    tag: 'CPU bound', name: 'Thread-parallel workloads',
    body: 'Computation saturates all available cores. Scales linearly with vCPU count up to a ceiling. Scoring favors instances that satisfy your vCPU and RAM request at the best composite score; instance-family and clock-speed awareness are planned.',
    tools: ['Variant calling', 'De novo assembly', 'RNA-seq quantification'],
    vcpu: 32, ram: '64–512 GB', disk: '1–5 TB', spot: 'Depends on tool',
  },
  {
    tag: 'Memory bound', name: 'Large in-memory index workloads',
    body: 'The bottleneck is loading a reference database or contact matrix into RAM. Scoring applies a hard RAM floor filter — instances below the minimum are eliminated before any scoring occurs.',
    tools: ['Metagenomics classification', 'Single-cell RNA-seq', 'Hi-C chromatin'],
    vcpu: 32, ram: '128–512 GB', disk: '2–6 TB', spot: 'Sometimes',
  },
  {
    tag: 'GPU / ML', name: 'GPU inference and training',
    body: 'Structure prediction, variant calling acceleration, and basecalling all saturate GPU compute. cloudfit filters by GPU count and VRAM before scoring. Split recommendations for multi-stage workloads (CPU MSA → GPU inference) are planned.',
    tools: ['Protein structure prediction', 'GPU variant calling', 'ONT basecalling'],
    vcpu: 8, ram: '32–64 GB', disk: '1–3 TB', spot: 'No — long-running',
  },
  {
    tag: 'Burst parallel', name: 'Scatter-gather fleet workloads',
    body: 'Each task is an independent stateless container. The right recommendation is many small preemptible instances — not one large one. Fleet recommendations (many small spot instances instead of one large node) are planned for burst archetypes.',
    tools: ['Nextflow pipelines', 'Snakemake DAGs', 'WDL / Cromwell scatter'],
    vcpu: 4, ram: '16–32 GB', disk: '< 1 TB', spot: 'Yes — restart-tolerant',
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
