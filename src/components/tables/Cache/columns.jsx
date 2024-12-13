export const columns = () => [
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "tag",
        header: "Tag",
        cell: ({ row }) => {
			const tag = row.original.tag;

			return (
				<span>{tag <= 0 ? "0" : tag}</span>
			);
		},
    },
    {
        accessorKey: "valid",
        header: "Valid",
        cell: ({ row }) => {
			const tag = row.original.tag;

			return (
				<span>{tag < 0 ? "0" : "1"}</span>
			);
		},
    },
    {
        accessorKey: "data",
        header: "Data",
    }
];
