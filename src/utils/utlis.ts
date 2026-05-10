export enum ExternalService {
    CV, GITHUB, LINKEDIN
};

export const openExternalURL = (service: ExternalService) => {
    let url;
    switch(service) {
     case ExternalService.CV: 
        url = import.meta.env.VITE_CV_PATH;
        break;
    case ExternalService.GITHUB: 
        url = import.meta.env.VITE_GITHUB_PROFILE;
        break;
    case ExternalService.LINKEDIN: 
        url = import.meta.env.VITE_LINKED_IN_PROFILE;
        break;
    }

    window.open(url, '_blank')
}
