import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Pet } from '@validation/schema/pet.schema';
import Link from 'next/link';

interface Props {
  pet: Pet;
}

function PetCard({ pet }: Props) {
  return (
    <Card maxW="sm" marginRight="0.75rem" border="1px solid #f7f7f7">
      <Link href={`/pets/${pet.id}`}>
        <CardBody>
          <Image src={pet.images[0]} borderRadius="lg" alt={pet.name} />
          <Stack mt="6" spacing="3">
            <Heading size="md">{pet.name}</Heading>
            <Text>{pet.description.slice(0, 60)}</Text>
            <Text color="blue.600" fontSize="2xl">
              Age: {pet.age}
            </Text>
          </Stack>
        </CardBody>
      </Link>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Link href={`/pets/${pet.id}`}>
            <Button variant="solid" colorScheme="blue">
              View
            </Button>
          </Link>
          <Button variant="ghost" colorScheme="blue">
            Like
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
export default PetCard;
