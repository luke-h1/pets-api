import { CreateUserInput } from '@api/schema/auth.schema';
import { faker } from '@faker-js/faker';

const generateTestUsers = (count: number): CreateUserInput['body'][] => {
  return Array.from({ length: count }, () => ({
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password(),
  }));
};
export default generateTestUsers;
