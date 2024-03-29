import { Pipe, PipeTransform } from '@angular/core';
import { Tale, User } from '@api/models';
import { LogService } from '@shared/core';
import { TaleAuthor } from '@tales/models/tale-author';

// Given a list of tales, returns only tales that were created by the current user
@Pipe({name: 'searchTales'})
export class SearchTalesPipe implements PipeTransform {
  constructor(private logger: LogService) {  }

  transform(value: Array<Tale>, searchQuery: string, creators: Map<string, User>): Array<Tale> {
    // Short-circuit for null case(s)
    if (!searchQuery || !value || !value.length) {
      return value;
    }

    const query = searchQuery.toLowerCase();

    const filteredTales: Array<Tale> = [];
    value.forEach((tale: Tale) => {
      // Check title / description / creator first (should catch 99% of cases)
      if (tale.title && tale.title.toLowerCase().includes(query)) {
        this.logger.info("Found in title: ", tale.title);
        filteredTales.push(tale);
      } else if (tale.description && tale.description.toLowerCase().includes(query)) {
        this.logger.info("Found in description: ", tale.description);
        filteredTales.push(tale);
      } else if (tale.category && tale.category.toLowerCase().includes(query)) {
        this.logger.info("Found in category: ", tale.category);
        filteredTales.push(tale);
      } else if (tale._id && creators && creators[tale._id] && creators[tale._id].name
            && creators[tale._id].name.toLowerCase().includes(query)) {
        this.logger.info("Found in creator name: ", creators[tale._id].name);
        filteredTales.push(tale);
      } else {
        this.logger.info("Query not found in title/description/creator, searching authors ", tale);

        // Otherwise, check authors exhaustively
        if (tale.authors.some((author: TaleAuthor) => {
          const firstNameContains = author.firstName && author.firstName.toLowerCase().includes(query);
          const lastNameContains = author.lastName && author.lastName.toLowerCase().includes(query);
          const orcidContains = author.orcid && author.orcid.toLowerCase().includes(query);
          const result = firstNameContains || lastNameContains || orcidContains;

          return result;
        })) {
          this.logger.info(`Found in author`, tale);
          filteredTales.push(tale);
        } else {
          this.logger.debug(`Search query does not match this Tale`, tale);
        }
      }
    });

    return filteredTales;
  }
}
