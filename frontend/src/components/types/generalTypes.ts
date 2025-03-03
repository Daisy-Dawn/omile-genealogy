export type FamilyMember = {
    _id: string
    name: string
    parent: string
    bio: string
    picture: string
    descendants: {
        marriedTo: { name: string; _id: string; picture: string }[]
        children: { name: string; _id: string; bio: string; picture: string }[]
        grandchildren: {
            name: string
            _id: string
            bio: string
            picture: string
        }[]
        greatgrandchildren: {
            name: string
            _id: string
            bio: string
            picture: string
        }[]
    }
}

export type ApiResponse = {
    totalRecords: number
    data: FamilyMember[]
}
