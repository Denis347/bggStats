import {
  DataTable,
} from "@carbon/react";
const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} = DataTable;

const CustomDataTable = (props) => {
  const { data, headers, title, sortable } = props;
  return (
    <DataTable rows={data} headers={headers} isSortable={sortable}>
      {({ rows, headers, getHeaderProps, getTableProps }) => (
        <TableContainer title={title}>
          <Table {...getTableProps()} useZebraStyles>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader {...getHeaderProps({ header })}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  {row.cells.map((cell) => {
                    if (cell.id.includes("Percentage")) {
                      return (
                        <TableCell key={cell.id}>{cell.value} %</TableCell>
                      );
                    } else if (cell.id.includes("Game")) {
                        const gameId = data.find(d => d.Game === cell.value).GameId;
                        return <TableCell key={cell.id}><a target="_blank" href={`https://boardgamegeek.com/boardgame/${gameId}`}>{cell.value}</a></TableCell>;
                    }
                    return <TableCell key={cell.id}>{cell.value}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  );
};

export default CustomDataTable;
