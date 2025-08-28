import { getCollection } from 'astro:content';

export async function GET() {
  const allPosts = await getCollection('blog');
  
  // Create search index with just the essential data
  const searchIndex = allPosts.map(post => ({
    title: post.data.title || '',
    description: post.data.description || '',
    tags: post.data.tags || [],
    slug: `/blog/${post.slug}`
  }));

  // Fuse.js options
  const fuseOptions = {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'description', weight: 0.3 },
      { name: 'tags', weight: 0.2 }
    ],
    includeScore: true,
    threshold: 0.4,
    minMatchCharLength: 2
  };

  return new Response(
    JSON.stringify({
      index: searchIndex,
      options: fuseOptions
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}
