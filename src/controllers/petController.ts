import { Request, Response } from 'express';
import NotFoundError from '../errors/NotFoundError';
import {
  CreatePetRequest,
  DeletePetReqeust,
  GetPetRequest,
  UpdatePetRequest,
} from '../requests/pet';
import PetService from '../services/petService';

export default class PetController {
  private readonly petService: PetService;

  constructor() {
    this.petService = new PetService();
  }

  async getPets(req: Request, res: Response) {
    const pets = await this.petService.getPets();
    return res.status(200).json(pets);
  }

  async getPet(req: GetPetRequest, res: Response) {
    const pet = await this.petService.getPet(req.params.id);

    if (!pet) {
      throw new NotFoundError({
        title: 'Pet not found',
        code: 'PetNotFound',
        message: 'Pet not found',
        statusCode: 404,
      });
    }
    return res.status(200).json(pet);
  }

  async createPet(req: CreatePetRequest, res: Response) {
    const newPet = await this.petService.createPet(
      req.body,
      req.session.userId,
    );
    return res.status(201).json(newPet);
  }

  async updatePet(req: UpdatePetRequest, res: Response) {
    const pet = req.body;
    const updatedPet = await this.petService.updatePet(req.params.id, pet);
    return res.status(200).json(updatedPet);
  }

  async deletePet(req: DeletePetReqeust, res: Response) {
    await this.petService.deletePet(req.params.id);
    return res.status(200).json();
  }
}
