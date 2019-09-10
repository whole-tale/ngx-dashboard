import { Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeValue } from '@angular/platform-browser';

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(value: string | SafeValue, context: string | SecurityContext): SafeResourceUrl {
    if (typeof context === 'string') {
      // Parse string context into SecurityContext type
      switch (context) {
        case 'none':
          context = SecurityContext.NONE;
          break;
        case 'html':
          context = SecurityContext.HTML;
          break;
        case 'style':
          context = SecurityContext.STYLE;
          break;
        case 'script':
          context = SecurityContext.SCRIPT;
          break;
        case 'url':
          context = SecurityContext.URL;
          break;
        case 'resource_url':
          context = SecurityContext.RESOURCE_URL;
          break;
        default:
          console.error('Error: Unrecognized string security context encountered. Falling back to NONE:', context);
          context = SecurityContext.NONE;
          break;
      }
    }

    // Sanitize the string for use in the given SecurityContext
    const sanitized = this.sanitizer.sanitize(context, value);
    return this.sanitizer.bypassSecurityTrustResourceUrl(sanitized);
  }
}
