export enum ExternalService {
  CV,
  GITHUB,
  LINKEDIN,
}

function urlFor(service: ExternalService): string | undefined {
  switch (service) {
    case ExternalService.CV:
      return import.meta.env.VITE_CV_PATH
    case ExternalService.GITHUB:
      return import.meta.env.VITE_GITHUB_PROFILE
    case ExternalService.LINKEDIN:
      return import.meta.env.VITE_LINKED_IN_PROFILE
  }
}

export const openExternalURL = (service: ExternalService) => {
  const url = urlFor(service)
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}
