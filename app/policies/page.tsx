import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Policies',
  description: 'Repository policies — content policy, open access, submission process, data preservation, and takedown procedure.',
}

const SECTIONS = [
  {
    heading: 'Content policy',
    body: `The repository accepts scholarly and research outputs produced by current and former members of the Godfrey Okoye University community. Eligible item types include doctoral theses, master's dissertations, peer-reviewed articles, books, book chapters, conference papers, and technical reports. Works must be original, complete, and free from content that violates third-party intellectual property rights. The university reserves the right to decline or withdraw items that do not meet these criteria.`,
  },
  {
    heading: 'Open access policy',
    body: `Godfrey Okoye University endorses the principle of open access. All items deposited in the repository are made freely and permanently available to the global research community. Authors are encouraged — where publisher agreements permit — to deposit the final accepted manuscript. The repository does not impose embargo periods. Authors retain their copyright and grant the university a non-exclusive, royalty-free licence to reproduce, distribute, and preserve the work.`,
  },
  {
    heading: 'Submission and review process',
    body: `Items are submitted by registered members of the university community through the online deposit interface. Each submission is reviewed by a repository administrator to verify completeness of metadata, file quality, and compliance with content policy before publication. Authors receive notification when their item is published or if additional information is required. Administrators may request revisions; items that cannot be brought into compliance will be rejected with an explanation.`,
  },
  {
    heading: 'Metadata standards',
    body: `All items are described using Dublin Core metadata elements in accordance with the Open Archives Initiative Protocol for Metadata Harvesting (OAI-PMH 2.0). Subject classifications follow the Library of Congress Classification system. Authors are encouraged to provide complete metadata, including ORCID identifiers, Digital Object Identifiers (DOIs), and accurate author name forms.`,
  },
  {
    heading: 'Data preservation commitment',
    body: `The university is committed to the long-term preservation of all deposited items. Files are stored on institutionally managed infrastructure with regular backups. The repository maintains permanent, stable URIs for all records. Metadata records are preserved indefinitely; file content is preserved for a minimum of ten years from the date of deposit, subject to ongoing institutional capacity.`,
  },
  {
    heading: 'Takedown procedure',
    body: `The university recognises that, in exceptional circumstances, it may be necessary to remove or restrict access to a deposited item. Requests for takedown must be submitted in writing to eprints@gouni.edu.ng and must clearly state the grounds for the request (for example: copyright infringement, factual error, or data protection concern). Requests will be reviewed within ten working days. Where a takedown is approved, the item will be removed from public view while its metadata record and URI remain, bearing a note that the item has been withdrawn.`,
  },
]

export default function PoliciesPage() {
  return (
    <div className="max-w-content section-pad">
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted mb-2">
        Policies
      </p>
      <h1 className="text-3xl mb-2">
        Repository <span className="accent">policies</span>
      </h1>
      <p className="text-muted mb-12">
        Governing the deposit, access, and preservation of research outputs.
      </p>

      <div className="max-w-2xl space-y-10">
        {SECTIONS.map(section => (
          <section key={section.heading}>
            <h2 className="text-xl mb-3">{section.heading}</h2>
            <p className="text-[0.9375rem] leading-relaxed text-slate-600">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  )
}
