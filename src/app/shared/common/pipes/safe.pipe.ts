import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeValue } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(value: string | SafeValue, context: string | SecurityContext): SafeResourceUrl {
    let secContext;
    if (typeof context === 'string') {
      // Parse string context into SecurityContext type
      switch (context) {
        case 'none':
          secContext = SecurityContext.NONE;
          break;
        case 'html':
          secContext = SecurityContext.HTML;
          break;
        case 'style':
          secContext = SecurityContext.STYLE;
          break;
        case 'script':
          secContext = SecurityContext.SCRIPT;
          break;
        case 'url':
          secContext = SecurityContext.URL;
          break;
        case 'resource_url':
          secContext = SecurityContext.RESOURCE_URL;
          break;
        default:
          console.error('Error: Unrecognized string security context encountered. Falling back to NONE:', context);
          secContext = SecurityContext.NONE;
          break;
      }
    } else {
      secContext = context;
    }

    // Sanitize the string for use in the given SecurityContext
    const sanitized = this.sanitizer.sanitize(secContext, value);

    return this.sanitizer.bypassSecurityTrustResourceUrl(sanitized);
  }
}
