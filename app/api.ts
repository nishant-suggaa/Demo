import { v4 as randomUUID } from 'uuid';

const fetchItems = async () => {
    const response = await fetch('https://balanced-llama-90.hasura.app/v1/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-hasura-admin-secret': 'bszlpnOTcyf6O29KkR0Z6pUZPdBSrDDdJcM8V4n7AqNPPmw4qIKEfaz41CJT5sn7',
      },
      body: JSON.stringify({
        query: `
          query {
            item {
              id
              created_at
              updated_at
              item_name
              item_category
            }
          }
        `,
      }),
    });
    const data = await response.json();
    return data.data.item;
  };



  type ItemData = {
    item_name: string;
    item_category: string;
  };

const createItem = async (inputData: ItemData) => {
    try {
      const response = await fetch('https://balanced-llama-90.hasura.app/v1/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-hasura-admin-secret': 'bszlpnOTcyf6O29KkR0Z6pUZPdBSrDDdJcM8V4n7AqNPPmw4qIKEfaz41CJT5sn7',
        },
        body: JSON.stringify({
          query: `
            mutation ($input: item_insert_input!) {
              insert_item_one(object: $input) {
                id
              }
            }
          `,
          variables: {
            input: {...inputData, id: randomUUID()},
          },
        }),
      });
  
      const result = await response.json();
  
      console.log('Create Item Response:', result);
  
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }
  
      if (result.data && result.data.insert_item_one) {
        return result.data.insert_item_one;
      } else {
        throw new Error('Failed to create item. Check the response data.');
      }
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  };
  
  export { fetchItems, createItem };
  