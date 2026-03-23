import 'dotenv/config';

export async function getBookInfo({ title }) {
    const base = "https://api.hardcover.app/v1/graphql";

    // 1. Build your filter object normally
    const whereClause = title

    // 2. Define the query using a variable placeholder ($where)
    const query = `
        query SearchByTitle($where: String!) {
            search(query: $where, query_type: Book, per_page: 1) {
                error
                results
            }
        }
    `;

    const res = await fetch(base, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${process.env.HARDCOVER_AUTH}`
        },
        // 3. Pass the query and variables as separate keys in the body
        body: JSON.stringify({
            query: query,
            variables: {
                where: whereClause
            }
        })
    });

    const data = await res.json();

    if (data.errors) {
        console.error("GraphQL Error Detail:", JSON.stringify(data.errors, null, 2));
        return {
            type: 'error',
            error: data.errors.map((e)=>e.message).join(', ')
        };
    }
    const book = data?.data?.search?.results?.hits?.[0].document;
    if (!book) {
        return {
            type: 'error',
            error: `No results found for ${title}${year ? ` (${year})` : ''}`
        };
    }

    return {
        type: 'book',
        title: book.title,
        release_year: book.release_year,
        authors: book.contributions?.map((c) => c.author?.name).filter(Boolean).join(', ') || 'Unknown',
        url: `https://hardcover.app/books/${book.slug}`,
        description: book.description || 'No description available',
    };
}
