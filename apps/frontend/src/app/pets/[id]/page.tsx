import Page from '@frontend/components/Page/Page';

interface Props {
  params: {
    id: string;
  };
}

export default function PetPage({ params }: Props) {
  const { id } = params;
  return <Page>Pet {id} page</Page>;
}
