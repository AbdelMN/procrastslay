import { Table } from '@chakra-ui/react';

type TaskList = {
  title: string;
  type: string;
  id: string;
};

type TaskListProps = {
  tasklist: TaskList[];
};
const TaskList = ({ tasklist }: TaskListProps) => {
  return (
    <Table.Root size="sm">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Nom</Table.ColumnHeader>
          <Table.ColumnHeader>Type</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {tasklist.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.title}</Table.Cell>
            <Table.Cell>{item.type}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default TaskList;
