import Page from '@frontend/components/Page/Page';

export const runtime = 'edge';

interface Props {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: Props) {
  const { id } = params;
  return <Page>User {id} page</Page>;
}