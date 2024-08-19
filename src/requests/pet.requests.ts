import { Request } from 'express';
import {
  CreatePetInput,
  DeletePetInput,
  GetPetInput,
  UpdatePetInput,
} from '../schema/pet.schema';

export type GetPetRequest = Request<GetPetInput['params']>;

export type CreatePetRequest = Request<{}, {}, CreatePetInput['body']>;

export type UpdatePetRequest = Request<UpdatePetInput['params']>;

export type DeletePetReqeust = Request<DeletePetInput['params']>;
