import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'About GOREPO — scope, open access statement, and technical information.',
}

export default function AboutPage() {
  return (
    <div className="max-w-content section-pad">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-2">
        About
      </p>
      <h1 className="text-3xl mb-2">
        About the <span className="accent">repository</span>
      </h1>
      <p className="text-muted mb-12">
        Godfrey Okoye University Institutional Repository
      </p>

      <div className="max-w-2xl space-y-10">
        {[
          {
            heading: 'Overview',
            body: `GOREPO is the institutional research repository of Godfrey Okoye University, Enugu, Nigeria. It provides open access to the scholarly and research output of the university community — including doctoral theses, master's dissertations, peer-reviewed journal articles, books, book chapters, conference papers, and technical reports.`,
          },
          {
            heading: 'Scope',
            body: `The repository accepts works produced by members of the Godfrey Okoye University community — students, academic staff, and researchers — across all faculties and departments. Works must be finalized and, where applicable, have received institutional approval prior to deposit. The repository covers all academic disciplines represented at the university.`,
          },
          {
            heading: 'Open access statement',
            body: `Godfrey Okoye University is committed to open access to knowledge. All items deposited in the repository are made freely available to the global research community without embargo, in line with the Budapest Open Access Initiative. Authors retain copyright over their works; the university holds a non-exclusive licence to preserve and distribute them.`,
          },
          {
            heading: 'Metadata standards',
            body: `All items are described using Dublin Core metadata elements and are harvestable via the OAI-PMH 2.0 protocol. Subject classifications follow the Library of Congress Classification system.`,
            links: [
              { label: 'OAI-PMH base URL', href: '/api/oai?verb=Identify', display: 'https://eprints.gouni.edu.ng/api/oai' },
              { label: 'Atom feed',        href: '/api/feed/atom',          display: 'https://eprints.gouni.edu.ng/api/feed/atom' },
              { label: 'RSS feed',         href: '/api/feed/rss',           display: 'https://eprints.gouni.edu.ng/api/feed/rss' },
            ],
          },
          {
            heading: 'Contact',
            body: `For enquiries about depositing, accessing, or withdrawing items, please contact the repository administrator.`,
            contact: true,
          },
        ].map(section => (
          <section key={section.heading}>
            <h2 className="text-xl mb-3">{section.heading}</h2>
            <p className="text-[0.9375rem] leading-relaxed text-slate-600">{section.body}</p>
            {section.links && (
              <ul className="mt-4 space-y-2">
                {section.links.map(l => (
                  <li key={l.label} className="text-sm text-slate-600">
                    <strong className="text-ink">{l.label}:</strong>{' '}
                    <a href={l.href} className="text-accent hover:underline font-mono text-xs">
                      {l.display}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {section.contact && (
              <div className="mt-4 space-y-1 text-sm text-slate-600">
                <p>
                  <strong className="text-ink">Email:</strong>{' '}
                  <a href="mailto:eprints@gouni.edu.ng" className="text-accent hover:underline">
                    eprints@gouni.edu.ng
                  </a>
                </p>
                <p>
                  <strong className="text-ink">Address:</strong> Library Services, Godfrey Okoye
                  University, Thinkers Corner, Enugu, Nigeria
                </p>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}
