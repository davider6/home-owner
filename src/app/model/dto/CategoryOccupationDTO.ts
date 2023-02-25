export class CategoryOccupationDTO {
    categoryId: number;
    catName: string;
    catDescription: string;
    catImage: string;
    occupationId: number;
    occName: string;
    occDescription: string;
    occImage: string;

    constructor(categoryId: number,
                catName: string,
                catDescription: string,
                catImage: string,
                occupationId: number,
                occName: string,
                occDescription: string,
                occImage: string) {
            this.categoryId = categoryId;
            this.catName = catName;
            this.catDescription = catDescription;
            this.catImage = catImage;
            this.occupationId = occupationId;
            this.occName = occName;
            this.occDescription = occDescription;
            this.occImage = occImage;
    }
  }
