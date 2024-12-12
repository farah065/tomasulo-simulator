export const columns = () => [
    {
        accessorKey: "instruction",
        header: "Instruction",
    },
    {
        accessorKey: "issue",
        header: "Issue",
        cell: ({ row }) => {
			const issue = row.original.issue;

			return (
				<span>{issue == 0? "0" : issue}</span>
			);
		},
    },
    {
        accessorKey: "execute",
        header: "Execute",
    },
    {
        accessorKey: "writeResult",
        header: "Write Result",
    },
];
