export const columns = () => [
    {
        accessorKey: "tag",
        header: "Tag",
    },
    {
        accessorKey: "busy",
        header: "Busy",
        cell: ({ row }) => {
			const busy = row.original.busy;

			return (
				<span>{busy > 1 ? busy : busy}</span>
			);
		},
    },
    {
        accessorKey: "address",
        header: "A",
        cell: ({ row }) => {
			const address = row.original.address;

			return (
				<span>{address == -1 ? 0 : address}</span>
			);
		},
    }
];
