import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export const GET: APIRoute = async ({url}): Promise<Response> => {
    const query: string | null = url.searchParams.get('query')

    // Handle if query is not in the url (not present)
    if (query === null) {
        return new Response(JSON.stringify({
            error: "Query param is missing"
        }), {
            status: 400, // Bad request
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    const allBlogArticles: CollectionEntry<'blog'>[] = await getCollection('blog');

    const searchResults = allBlogArticles.filter(article => {
        const titleMatch: boolean = article.data.title
            .toLowerCase()
            .includes(query!.toLocaleLowerCase())
    
        const bodyMatch: boolean = article.body
            .toLowerCase()
            .includes(query!.toLocaleLowerCase())
    
        const slugMatch: boolean = article.slug
            .toLowerCase()
            .includes(query!.toLocaleLowerCase())
    
        return titleMatch || bodyMatch || slugMatch
    })

    return new Response(JSON.stringify({ searchResults }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    })
};