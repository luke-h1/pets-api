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
    /**
     * @swagger
     * /api/pets:
     *   get:
     *     summary: Get all pets
     *     responses:
     *       200:
     *         description: A list of pets
     */
    this.app.get('/api/pets', (req, res) => {
      return this.petController.getPets(req, res);
    });

    /**
     * @swagger
     * /api/pets/{id}:
     *   get:
     *     summary: Get a pet by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A pet object
     */
    this.app.get(
      '/api/pets/:id',
      validateResource(getPetSchema),
      (req: GetPetRequest, res: Response) =>
        this.petController.getPet(req, res),
    );

    /**
     * @swagger
     * /api/pets:
     *   post:
     *     summary: Create a new pet
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreatePetRequest'
     *     responses:
     *       201:
     *         description: The created pet
     */
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

    /**
     * @swagger
     * /api/pets/{id}:
     *   delete:
     *     summary: Delete a pet by ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       204:
     *         description: No content
     */
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
