import { db, queryClient } from './index.js';
import { categories, posts } from './schema/index.js';
import { CATEGORIES } from '@shodasha/shared';
async function seed() {
    console.log('Seeding initial categories...');
    const categoryMap = new Map();
    for (const cat of CATEGORIES) {
        const [inserted] = await db
            .insert(categories)
            .values({
            slug: cat.slug,
            name: cat.name,
            description: cat.description,
        })
            .onConflictDoUpdate({
            target: categories.slug,
            set: { name: cat.name, description: cat.description },
        })
            .returning();
        if (inserted) {
            categoryMap.set(cat.slug, inserted.id);
        }
    }
    console.log('Categories seeded successfully.');
    // Sample Jantar Mantar Posts based on real events (NEET, CJP, Sonam Wangchuk)
    const samplePosts = [
        // --- 1. protest-gatherings ---
        {
            title: 'Cockroach Janta Party (CJP) Resumes Sit-in Post-Clashes',
            body: 'Despite the heavy police intervention on July 20, CJP members and student organizations have returned to the Jantar Mantar site. Security is visibly heightened, with RAF forces deployed. The organizers maintain they will continue their peaceful sit-in demanding the resignation of the Education Minister.',
            categorySlug: 'protest-gatherings',
            postType: 'event_update',
            upvotes: 215,
            downvotes: 12,
        },
        {
            title: 'Sonam Wangchuk Hospitalized After 21-Day Hunger Strike',
            body: 'Activist Sonam Wangchuk was forcibly moved to a medical facility on July 18 after a prolonged fast demanding Ladakh’s statehood and environmental safeguards. Supporters at Jantar Mantar continue holding silent vigils in his absence.',
            categorySlug: 'protest-gatherings',
            postType: 'eyewitness',
            upvotes: 412,
            downvotes: 5,
        },
        {
            title: 'Student Activists End 23-Day Fast After Civil Society Appeal',
            body: 'Three student activists protesting the 2026 NEET paper leak ended their hunger strike today. They broke their fast with juice offered by opposition legislators, though they stated the overall agitation will persist in other forms.',
            categorySlug: 'protest-gatherings',
            postType: 'event_update',
            upvotes: 189,
            downvotes: 22,
        },
        {
            title: 'Traffic Advisory: Sansad Marg Blocked Due to Demonstrations',
            body: 'Delhi Traffic Police have cordoned off routes leading from Connaught Place to Parliament Street. Commuters are advised to avoid Tolstoy Marg and use alternative routes as the student protests swell in numbers.',
            categorySlug: 'protest-gatherings',
            postType: 'event_update',
            upvotes: 310,
            downvotes: 8,
        },
        {
            title: 'Medical Camp Setup at Jantar Mantar for Protesters',
            body: 'Volunteer doctors have established a temporary triage center near the main stage to treat dehydration and exhaustion among those participating in the ongoing sit-in protests. Donations of ORS and water are being requested.',
            categorySlug: 'protest-gatherings',
            postType: 'eyewitness',
            upvotes: 156,
            downvotes: 2,
        },
        // --- 2. civic-issues ---
        {
            title: 'The Systemic Failure of Centralized Examination Boards',
            body: 'The 2026 NEET paper leak is not an isolated incident. It points to a deep systemic rot in how centralized bodies like NTA manage logistics. We need a decentralized model for medical entrances to prevent these mass-scale irregularities.',
            categorySlug: 'civic-issues',
            postType: 'opinion',
            upvotes: 388,
            downvotes: 45,
        },
        {
            title: 'Why the CJP Demands a Judicial Probe into CBSE On-Screen Marking',
            body: 'The opaque nature of the On-Screen Marking (OSM) system has led to widespread discrepancies in 12th board results. The CJP\'s demand for an independent judicial probe is necessary to restore faith in the evaluation process.',
            categorySlug: 'civic-issues',
            postType: 'discussion',
            upvotes: 145,
            downvotes: 18,
        },
        {
            title: 'Environmental Cost of Himalayan Development Projects',
            body: 'Wangchuk’s fast brings attention back to the unchecked infrastructural expansion in eco-sensitive zones. Jantar Mantar is currently hosting several environmental NGOs amplifying the demand for Schedule 6 protections for Ladakh.',
            categorySlug: 'civic-issues',
            postType: 'opinion',
            upvotes: 275,
            downvotes: 11,
        },
        {
            title: 'Police Brutality Against Peaceful Dissent is Unacceptable',
            body: 'The use of tear gas and lathicharge on unarmed students during the "Sansad Chalo" march on July 20 violates fundamental democratic rights. Dissent is a safety valve of democracy, not a crime.',
            categorySlug: 'civic-issues',
            postType: 'opinion',
            upvotes: 520,
            downvotes: 89,
        },
        {
            title: 'Mental Health Toll on Medical Aspirants Post-NEET Leak',
            body: 'We are ignoring the psychological impact on millions of 18-year-olds who prepared for years, only to have the exam compromised. The uncertainty surrounding re-tests is causing a mental health crisis among the youth.',
            categorySlug: 'civic-issues',
            postType: 'discussion',
            upvotes: 410,
            downvotes: 15,
        },
        // --- 3. policy-reviews ---
        {
            title: 'Analyzing the Proposed "Public Examination (Prevention of Unfair Means) Act"',
            body: 'The government’s new draft bill proposes up to 10 years imprisonment for organized paper leaks. However, critics at the protest point out it lacks provisions holding the top bureaucracy of NTA accountable, focusing only on the lowest links.',
            categorySlug: 'policy-reviews',
            postType: 'policy_review',
            upvotes: 198,
            downvotes: 14,
        },
        {
            title: 'Review: Union Health Minister’s Response to CJP Demands',
            body: 'J.P. Nadda assured internal discussions but offered no concrete timeline for a CBI inquiry into the NEET leak. The lack of written assurance is why the student organizations have rejected the appeal to end the protest.',
            categorySlug: 'policy-reviews',
            postType: 'policy_review',
            upvotes: 245,
            downvotes: 30,
        },
        {
            title: 'Legal Precedents for Scrapping the NEET 2026 Results',
            body: 'Based on the 2015 AIPMT cancellation by the Supreme Court, if the leak is widespread, the entire exam must be voided. A localized leak might not warrant a national re-test, but current evidence suggests telegram groups disseminated papers pan-India.',
            categorySlug: 'policy-reviews',
            postType: 'policy_review',
            upvotes: 312,
            downvotes: 42,
        },
        {
            title: 'Ladakh’s Demand for Sixth Schedule: A Constitutional Analysis',
            body: 'The Sixth Schedule allows for autonomous district councils. Granting this to Ladakh would empower locals to regulate land transfers and mining, directly addressing the environmental concerns raised by Sonam Wangchuk.',
            categorySlug: 'policy-reviews',
            postType: 'policy_review',
            upvotes: 187,
            downvotes: 9,
        },
        {
            title: 'The Role of RAF in Crowd Control: Standard Operating Procedures',
            body: 'The deployment of the Rapid Action Force at Jantar Mantar raises questions about the SOPs for crowd dispersal. The blue-uniformed riot police are meant for severe communal riots, not student protests. Is this an overreach?',
            categorySlug: 'policy-reviews',
            postType: 'discussion',
            upvotes: 234,
            downvotes: 27,
        },
        // --- 4. visitor-experiences ---
        {
            title: 'My Visit to the CJP Encampment: Organized and Resolute',
            body: 'I visited Jantar Mantar today expecting chaos. Instead, I found a highly organized camp. Students are running study circles, there’s a community kitchen (langar), and they are cleaning up the trash multiple times a day.',
            categorySlug: 'visitor-experiences',
            postType: 'eyewitness',
            upvotes: 456,
            downvotes: 12,
        },
        {
            title: 'Intimidating Security Presence at Parliament Street',
            body: 'Trying to walk down to Jantar Mantar today was unnerving. There are multiple layers of barricades, water cannons on standby, and police checking IDs. It feels less like a public square and more like a fortress.',
            categorySlug: 'visitor-experiences',
            postType: 'opinion',
            upvotes: 289,
            downvotes: 34,
        },
        {
            title: 'The Solidarity Displayed by Ordinary Delhiites',
            body: 'It was heartening to see local residents dropping off boxes of biscuits and crates of water for the fasting students. Despite the traffic inconvenience, many locals are verbally expressing support for the NEET aspirants.',
            categorySlug: 'visitor-experiences',
            postType: 'discussion',
            upvotes: 375,
            downvotes: 8,
        },
        {
            title: 'Getting Through the Barricades: A Guide for Supporters',
            body: 'If you plan to visit, approach from the Patel Chowk metro side. The Connaught Place entrance is heavily restricted. Don’t carry large bags, and be prepared to show your Aadhaar card if requested by the Delhi Police.',
            categorySlug: 'visitor-experiences',
            postType: 'event_update',
            upvotes: 145,
            downvotes: 3,
        },
        {
            title: 'Witnessing the Evening Candle March',
            body: 'Stayed till sunset yesterday. The transition from angry speeches to a silent candle march remembering the students whose futures are in jeopardy was incredibly moving. A very poignant atmosphere.',
            categorySlug: 'visitor-experiences',
            postType: 'eyewitness',
            upvotes: 210,
            downvotes: 5,
        },
        // --- 5. eyewitness-news ---
        {
            title: 'Clashes Erupt as Police Intercept "Sansad Chalo" March',
            body: 'Just witnessed the police using lathicharge near the second barricade. Protesters attempted to push through towards Parliament. Several students have been detained and loaded into buses. The situation is highly volatile right now.',
            categorySlug: 'eyewitness-news',
            postType: 'eyewitness',
            upvotes: 567,
            downvotes: 23,
        },
        {
            title: 'Tear Gas Fired at Parliament Street Intersection',
            body: 'Delhi police just deployed tear gas after a scuffle broke out at the front line of the CJP march. People are scattering. Visibility is low, and volunteers are handing out water to wash eyes. Stay away from the main intersection.',
            categorySlug: 'eyewitness-news',
            postType: 'eyewitness',
            upvotes: 498,
            downvotes: 18,
        },
        {
            title: 'Ambulances Arrive for Injured Protesters',
            body: 'I can see three ambulances moving through the crowd near the Jantar Mantar observatory entrance. Some students sustained head injuries during the baton charge. They are reportedly being taken to RML Hospital.',
            categorySlug: 'eyewitness-news',
            postType: 'eyewitness',
            upvotes: 345,
            downvotes: 7,
        },
        {
            title: 'Opposition Leaders Arrive at the Protest Site',
            body: 'Rahul Gandhi and a few other MPs have just arrived at Jantar Mantar to address the students. The crowd is chanting slogans against the NTA. Police have formed a tight ring around the VIPs.',
            categorySlug: 'eyewitness-news',
            postType: 'eyewitness',
            upvotes: 412,
            downvotes: 65,
        },
        {
            title: 'CJP Delegation Leaves for Meeting with Health Minister',
            body: 'A five-member delegation from the Cockroach Janta Party just left the protest site in a police escort vehicle to meet J.P. Nadda. The crowd has been asked to remain peaceful until they return with an update.',
            categorySlug: 'eyewitness-news',
            postType: 'eyewitness',
            upvotes: 278,
            downvotes: 12,
        },
        // --- 6. general ---
        {
            title: 'How long can the government ignore the youth?',
            body: 'With millions of students affected by the NEET leak, ignoring the protests at Jantar Mantar is political suicide. The youth demographic is too large to alienate over administrative incompetence.',
            categorySlug: 'general',
            postType: 'discussion',
            upvotes: 315,
            downvotes: 40,
        },
        {
            title: 'The historical significance of Jantar Mantar as a protest site',
            body: 'From the India Against Corruption movement to the Farmers’ Protest and now the NEET agitation, this small street next to an astronomical observatory remains the beating heart of Indian democracy.',
            categorySlug: 'general',
            postType: 'discussion',
            upvotes: 210,
            downvotes: 8,
        },
        {
            title: 'Can protests actually bring about policy change?',
            body: 'Looking at recent history, sustained pressure at Jantar Mantar does yield results, albeit slowly. The key is persistence and preventing the movement from being hijacked by fringe elements.',
            categorySlug: 'general',
            postType: 'discussion',
            upvotes: 189,
            downvotes: 15,
        },
        {
            title: 'Media Coverage of the NEET Protests is Disappointing',
            body: 'Mainstream news channels are focusing more on the traffic jams caused by the protests rather than the core issue: the compromised future of 24 lakh medical aspirants. This platform is vital for the real story.',
            categorySlug: 'general',
            postType: 'opinion',
            upvotes: 430,
            downvotes: 22,
        },
        {
            title: 'Call for a unified student movement across India',
            body: 'The CJP has initiated something important, but we need engineering, humanities, and commerce students to join in. The fight against paper leaks and corruption in education affects us all.',
            categorySlug: 'general',
            postType: 'opinion',
            upvotes: 295,
            downvotes: 19,
        },
    ];
    for (const post of samplePosts) {
        const categoryId = categoryMap.get(post.categorySlug);
        if (!categoryId)
            continue;
        await db.insert(posts).values({
            title: post.title,
            body: post.body,
            categoryId,
            postType: post.postType,
            upvotes: post.upvotes,
            downvotes: post.downvotes,
            trendingScore: (post.upvotes - post.downvotes) * 2,
        });
    }
    console.log('30 Sample Jantar Mantar posts seeded successfully.');
    await queryClient.end();
}
seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map