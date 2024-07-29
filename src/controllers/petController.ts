import { Pet } from '@prisma/client';
import { Request, Response } from 'express';
import NotFoundError from '../errors/NotFoundError';
import PetService from '../services/petService';

export default class PetController {
  private readonly petService: PetService;

  constructor() {
    this.petService = new PetService();
  }

  async getPets(req: Request, res: Response) {
    const pets = await this.petService.getPets();

    if (!pets) {
      throw new NotFoundError({
        title: 'Pets not found',
        code: 'NoPetsFound',
      });
    }

    return res.status(200).json(pets);
  }

  async getPet(req: Request, res: Response) {
    const pet = await this.petService.getPet(Number(req.params.id));

    if (!pet) {
      throw new NotFoundError({
        title: 'Pet not found',
        code: 'PetNotFound',
      });
    }

    return res.status(200).json(pet);
  }

  async createPet(req: Request, res: Response) {
    const pet: Pet = req.body;

    const newPet = await this.petService.createPet(pet);

    return res.status(201).json(newPet);
  }

  async updatePet(req: Request, res: Response) {
    const pet: Pet = req.body;

    const updatedPet = await this.petService.updatePet(
      Number(req.params.id),
      pet,
    );

    return res.status(200).json(updatedPet);
  }

  async deletePet(req: Request, res: Response) {
    await this.petService.deletePet(Number(req.params.id));

    return res.status(200).json();
  }
}
