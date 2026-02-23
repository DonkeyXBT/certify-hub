import { put, list, del, head } from "@vercel/blob"

const FRAMEWORK_PREFIX = "frameworks/"

export interface BlobFrameworkData {
  id: string
  code: string
  name: string
  version: string
  description: string | null
  status: string
  clauses: BlobClause[]
}

export interface BlobClause {
  id: string
  number: string
  title: string
  description: string | null
  isAnnex: boolean
  sortOrder: number
  controls: BlobControl[]
  children: BlobClause[]
}

export interface BlobControl {
  id: string
  number: string
  title: string
  category: string | null
  objective: string | null
  guidance: string | null
}

function blobPath(frameworkCode: string): string {
  return `${FRAMEWORK_PREFIX}${frameworkCode}.json`
}

export async function uploadFrameworkToBlob(
  data: BlobFrameworkData
): Promise<string> {
  const blob = await put(blobPath(data.code), JSON.stringify(data), {
    contentType: "application/json",
    addRandomSuffix: false,
    access: "private",
  })
  return blob.url
}

async function fetchBlobJson<T>(url: string): Promise<T | null> {
  try {
    // For private stores, the URL from list() includes a token query param
    const response = await fetch(url, { next: { revalidate: 3600 } })
    if (!response.ok) return null
    return response.json()
  } catch {
    return null
  }
}

export async function getFrameworkFromBlob(
  frameworkCode: string
): Promise<BlobFrameworkData | null> {
  try {
    const blobs = await list({ prefix: blobPath(frameworkCode) })
    const blob = blobs.blobs[0]
    if (!blob) return null

    return fetchBlobJson<BlobFrameworkData>(blob.downloadUrl)
  } catch {
    return null
  }
}

export async function getAllFrameworksFromBlob(): Promise<BlobFrameworkData[]> {
  try {
    const blobs = await list({ prefix: FRAMEWORK_PREFIX })
    const results: BlobFrameworkData[] = []

    for (const blob of blobs.blobs) {
      if (!blob.pathname.endsWith(".json")) continue
      try {
        const data = await fetchBlobJson<BlobFrameworkData>(blob.downloadUrl)
        if (data) results.push(data)
      } catch {
        // Skip individual failures
      }
    }

    return results.sort((a, b) => a.name.localeCompare(b.name))
  } catch {
    return []
  }
}

export async function deleteFrameworkFromBlob(
  frameworkCode: string
): Promise<void> {
  try {
    const blobs = await list({ prefix: blobPath(frameworkCode) })
    for (const blob of blobs.blobs) {
      await del(blob.url)
    }
  } catch {
    // Ignore delete failures
  }
}
