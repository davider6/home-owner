export class Occupations {
    id: number;
    name: string;
    description: string;
    categoryImage: string;
    status: boolean;
    expanded: boolean;

    constructor(id: number,
                name: string,
                description: string,
                categoryImage: string,
                status: boolean) {
      this.id = id;
      this.name = name;
      this.description = description;
      this.categoryImage = categoryImage;
      this.status = status;
      this.expanded = false;
    }

  }
