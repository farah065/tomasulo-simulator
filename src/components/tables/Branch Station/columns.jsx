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
				<span>{busy >= 1 ? 1 : "0"}</span>
			);
		},
    },
    {
        accessorKey: "Vj",
        header: "Vj",
    },
    {
        accessorKey: "Vk",
        header: "Vk",
    },
    {
        accessorKey: "Qj",
        header: "Qj",
    },
    {
        accessorKey: "Qk",
        header: "Qk",
    },
    {
        accessorKey: "brnchDestination",
        header: "Dest.",
    }
];
