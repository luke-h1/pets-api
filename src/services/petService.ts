import { Pet, PrismaClient } from '@prisma/client';
import prisma from '../db';

export default class PetService {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async getPets() {
    return this.prisma.pet.findMany();
  }

  async getPet(id: number) {
    return this.prisma.pet.findUnique({ where: { id } });
  }

  async createPet(pet: Pet) {
    return this.prisma.pet.create({ data: pet });
  }

  async updatePet(id: number, pet: Pet) {
    return this.prisma.pet.update({ where: { id }, data: pet });
  }

  async deletePet(id: number) {
    return this.prisma.pet.delete({ where: { id } });
  }
}
