import { ApolloCache, DocumentNode, OperationVariables, useMutation } from '@apollo/client';
import { toast } from 'erxes-ui';

// Drops every cached variant of the given root query fields, e.g. the student
// list of each classroom. refetchQueries alone only refreshes queries that are
// on screen, so a list cached for other variables would stay stale.
export const evictQueryFields = (
  cache: ApolloCache<unknown>,
  fieldNames: string[],
) => {
  for (const fieldName of fieldNames) {
    cache.evict({ id: 'ROOT_QUERY', fieldName });
  }

  cache.gc();
};

// Wraps a mutation with the plugin's success/error toasts. `evictFields`
// names the root query fields whose data the mutation changes; queries still
// on screen refetch themselves once their field is evicted.
export const useEdulabMutation = <TVariables extends OperationVariables>(
  mutation: DocumentNode,
  {
    evictFields,
    successTitle,
  }: { evictFields: string[]; successTitle: string },
) => {
  const [mutate, { loading }] = useMutation(mutation, {
    update: (cache) => evictQueryFields(cache, evictFields),
  });

  const run = (variables: TVariables, onDone?: () => void) =>
    mutate({
      variables,
      onCompleted: () => {
        toast({ title: successTitle, variant: 'success' });
        onDone?.();
      },
      onError: (error) =>
        toast({
          title: 'Алдаа гарлаа',
          description: error.message,
          variant: 'destructive',
        }),
    });

  return { run, loading };
};
