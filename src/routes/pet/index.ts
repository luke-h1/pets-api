import { Express, Response } from 'express';
import PetController from '../../controllers/petController';
import isAuth from '../../middleware/isAuth';
import isPetOwner from '../../middleware/isPetOwner';
import validateResource from '../../middleware/validateResource';
import {
  CreatePetRequest,
  DeletePetReqeust,
  GetPetRequest,
  UpdatePetRequest,
} from '../../requests/pet';
import {
  createPetSchema,
  deletePetSchema,
  getPetSchema,
  updatePetSchema,
} from '../../schema/pet.schema';

export default class PetRoutes {
  private readonly app: Express;

  private readonly petController: PetController;

  constructor(app: Express) {
    this.app = app;
    this.petController = new PetController();
  }

  public initRoutes(): void {
    this.app.get('/api/pets', (req, res) => {
      return this.petController.getPets(req, res);
    });

    this.app.get(
      '/api/pets/:id',
      validateResource(getPetSchema),
      (req: GetPetRequest, res: Response) =>
        this.petController.getPet(req, res),
    );

    this.app.post(
      '/api/pets',
      isAuth(),
      validateResource(createPetSchema),
      (req: CreatePetRequest, res: Response) => {
        return this.petController.createPet(req, res);
      },
    );

    this.app.put(
      '/api/pets/:id',
      isAuth(),
      validateResource(updatePetSchema),
      isPetOwner<UpdatePetRequest>(),
      async (req: UpdatePetRequest, res: Response) => {
        return this.petController.updatePet(req, res);
      },
    );

    this.app.delete(
      '/api/pets/:id',
      isAuth(),
      validateResource(deletePetSchema),
      isPetOwner<DeletePetReqeust>(),
      async (req: DeletePetReqeust, res: Response) => {
        return this.petController.deletePet(req, res);
      },
    );
  }
}
