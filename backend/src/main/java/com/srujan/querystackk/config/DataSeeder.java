package com.srujan.querystackk.config;

import com.srujan.querystackk.entity.*;
import com.srujan.querystackk.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CommunityRepository communityRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final VoteRepository voteRepository;
    private final TagRepository tagRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 1) {
            log.info("Database already seeded. Skipping.");
            return;
        }
        log.info("🌱 Seeding database...");

        Role userRole = roleRepository.findByName(Role.RoleName.ROLE_USER)
                .orElseGet(() -> roleRepository.save(Role.builder().name(Role.RoleName.ROLE_USER).build()));

        // ============== USERS ==============
        String[] usernames = {"alice", "bob", "charlie", "diana", "eve", "frank", "grace", "henry"};
        String[] displayNames = {"Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince",
                "Eve Adams", "Frank Castle", "Grace Hopper", "Henry Ford"};
        String[] bios = {
                "Full-stack dev. Coffee enthusiast. Building things that matter.",
                "Backend engineer. Java + Spring. Learning Rust in my spare time.",
                "Frontend wizard 🧙‍♂️ React + Tailwind advocate.",
                "Designer turned developer. I care about pixels.",
                "SRE by day, gamer by night. Distributed systems nerd.",
                "Indie hacker. Ship fast, learn faster.",
                "CS grad student. Research in ML systems.",
                "Startup founder. Failed 3 times. Trying again."
        };

        List<User> users = new ArrayList<>();
        for (int i = 0; i < usernames.length; i++) {
            User u = User.builder()
                    .username(usernames[i])
                    .email(usernames[i] + "@querystack.dev")
                    .password(passwordEncoder.encode("password123"))
                    .displayName(displayNames[i])
                    .bio(bios[i])
                    .profilePictureUrl("https://i.pravatar.cc/150?u=" + usernames[i])
                    .karmaPoints(random.nextInt(5000))
                    .enabled(true)
                    .roles(Set.of(userRole))
                    .build();
            users.add(userRepository.save(u));
        }

        // Make sure "srujan214" has admin-like role set too if it exists
        userRepository.findByUsername("srujan214").ifPresent(su -> {
            users.add(0, su);
        });

        log.info("✅ Created {} users", users.size());

        // ============== COMMUNITIES ==============
        String[][] communityData = {
                {"programming", "All things code. From C to Rust, from web to embedded."},
                {"webdev", "HTML, CSS, JavaScript, and everything in between."},
                {"reactjs", "A community for React developers."},
                {"java", "News, discussion, and questions about Java."},
                {"springboot", "Spring Framework and Spring Boot enthusiasts."},
                {"gaming", "The latest gaming news, reviews, and discussions."},
                {"movies", "Film discussion, reviews, and news."},
                {"music", "Share and discover music."},
                {"cooking", "Recipes, techniques, and food photos."},
                {"fitness", "Training, nutrition, and progress."},
                {"science", "Science news and discussion."},
                {"space", "Explore the cosmos."},
                {"books", "Book recommendations and discussions."},
                {"photography", "Share your best shots."},
                {"startups", "Building companies from scratch."},
                {"design", "UI/UX and visual design."},
                {"datascience", "Data, ML, and analytics."},
                {"devops", "CI/CD, containers, and infrastructure."},
                {"security", "Cybersecurity news and tips."},
                {"learnprogramming", "Beginner-friendly programming help."}
        };

        List<Community> communities = new ArrayList<>();
        for (String[] c : communityData) {
            Community comm = Community.builder()
                    .name(c[0])
                    .description(c[1])
                    .iconUrl("https://api.dicebear.com/7.x/shapes/svg?seed=" + c[0])
                    .bannerUrl("https://picsum.photos/seed/" + c[0] + "/1200/300")
                    .memberCount(random.nextInt(50000) + 1000)
                    .createdBy(users.get(random.nextInt(users.size())))
                    .isPrivate(false)
                    .build();
            communities.add(communityRepository.save(comm));
        }
        log.info("✅ Created {} communities", communities.size());

        // ============== TAGS ==============
        String[] tagNames = {"javascript", "python", "java", "spring", "react", "node", "docker",
                "kubernetes", "aws", "mysql", "postgres", "redis", "typescript", "rust",
                "go", "kotlin", "swift", "flutter", "ai", "ml", "web3", "blockchain"};
        List<Tag> tags = new ArrayList<>();
        for (String t : tagNames) {
            Tag tag = tagRepository.findByName(t)
                    .orElseGet(() -> tagRepository.save(Tag.builder().name(t).usageCount(random.nextInt(500)).build()));
            tags.add(tag);
        }

        // ============== POSTS ==============
        String[][] postTemplates = {
                {"How do you handle JWT refresh tokens in production?", "I've been building a Spring Boot app and struggling with the refresh token rotation. What's the industry standard? Rotating tokens, sliding sessions, or something else?", "TEXT"},
                {"What's the fastest way to learn React in 2026?", "I know vanilla JS. Where should I start with React? Any recommended roadmap?", "TEXT"},
                {"Just launched my SaaS after 6 months of work", "Built a small analytics tool for indie hackers. Would love feedback from the community!", "LINK"},
                {"My cat sat on my keyboard and now I have a job offer", "I was in a meeting and my cat walked over the keyboard. The recruiter thought it was hilarious. Now I have an offer.", "TEXT"},
                {"SQL vs NoSQL — which one for a social app?", "Building a Reddit clone. Should I use Postgres or MongoDB? The app will have posts, comments, votes, and users.", "TEXT"},
                {"TIL: You can use CSS :has() to style parent elements", "Game changer for form validation. No more JS hacks!", "TEXT"},
                {"The ultimate guide to Docker for beginners", "I wrote a 5000-word guide covering everything from images to compose. Free to read.", "LINK"},
                {"Unpopular opinion: Tailwind is overrated", "I've used it for 2 years and I still prefer CSS modules for anything non-trivial. Change my mind.", "TEXT"},
                {"Show HN: I built a code-snippet manager in a weekend", "It's basically Pastebin with syntax highlighting and folders. Feedback welcome!", "LINK"},
                {"What's the most underrated programming language?", "I'll start: Elixir. Everyone talks about Go and Rust, but Elixir's concurrency model is next level.", "TEXT"},
                {"Struggling with imposter syndrome after 3 years", "Feels like everyone around me knows more. How do you deal with this?", "TEXT"},
                {"My side project hit 10k users!", "Started as a joke, now it's a real thing. Here's what I learned about marketing.", "TEXT"},
                {"Best resources to learn system design?", "Preparing for senior interviews. Any recommendations?", "TEXT"},
                {"Finally finished my first open-source contribution!", "It was just a typo fix, but it feels great to be part of something bigger.", "TEXT"},
                {"Hot take: Monorepos are the future", "Turborepo, Nx, and Bazel make cross-project development so much nicer. Why isn't everyone doing this?", "TEXT"},
                {"Need help with a Spring Boot CORS issue", "My React frontend can't talk to my Spring backend. Already tried @CrossOrigin.", "TEXT"},
                {"What's your favorite VS Code extension?", "Mine is Error Lens. It shows errors inline. Saves me hours every week.", "TEXT"},
                {"I made a game with only HTML and CSS", "No JavaScript at all. It's a memory game. Took me 3 weeks to figure out.", "LINK"},
                {"Why is everyone switching to Bun?", "Node has been fine for me. What am I missing?", "TEXT"},
                {"How to stay productive while working from home?", "Struggling to separate work and life. Any tips that actually work?", "TEXT"},
                {"The state of JavaScript in 2026", "Annual survey results are out. React still dominates, but Svelte is gaining fast.", "LINK"},
                {"I automated my morning routine with Python", "Coffee maker, lights, and even my calendar. It's magical.", "TEXT"},
                {"Interview prep: 100 LeetCode problems or 10 projects?", "Which gets more offers? I keep hearing conflicting advice.", "TEXT"},
                {"Built a stock trading bot — here's what I learned", "It loses money, but the engineering lessons are priceless.", "TEXT"},
                {"Anyone else using Vim in 2026?", "After 10 years of VS Code, I switched. Never going back.", "TEXT"},
                {"How to make my portfolio stand out?", "Applying to junior roles. Have 5 projects. What else do I need?", "TEXT"},
                {"MySQL vs PostgreSQL in 2026", "For a new project. Any strong opinions?", "TEXT"},
                {"Explain Kubernetes like I'm 5", "I get Docker. Kubernetes is a mystery.", "TEXT"},
                {"The best CSS trick I learned this year", "Using clamp() for fluid typography. No more media queries for font sizes.", "TEXT"},
                {"Starting a career in cybersecurity", "Where do I begin? Certifications, projects, or internships?", "TEXT"}
        };

        List<Post> posts = new ArrayList<>();
        for (int i = 0; i < postTemplates.length; i++) {
            String[] tpl = postTemplates[i];
            Set<Tag> postTags = new HashSet<>();
            int numTags = 2 + random.nextInt(3);
            for (int j = 0; j < numTags; j++) {
                postTags.add(tags.get(random.nextInt(tags.size())));
            }

            Post p = Post.builder()
                    .title(tpl[0])
                    .content(tpl[1])
                    .imageUrl(tpl[2].equals("LINK") ? "https://picsum.photos/seed/post" + i + "/800/500" : null)
                    .postType(tpl[2])
                    .author(users.get(random.nextInt(users.size())))
                    .community(communities.get(random.nextInt(communities.size())))
                    .tags(postTags)
                    .voteCount(random.nextInt(2000) - 100)
                    .commentCount(0)
                    .locked(false)
                    .deleted(false)
                    .build();
            posts.add(postRepository.save(p));
        }
        log.info("✅ Created {} posts", posts.size());

        // ============== COMMENTS ==============
        String[] commentTexts = {
                "Great post! Really helped me understand this.",
                "I disagree. Here's why...",
                "This is exactly what I was looking for. Thanks!",
                "Bookmarked. Will try this weekend.",
                "Can you share the source code?",
                "I've been doing this for 5 years and never thought of this approach.",
                "Underrated advice. Everyone should read this.",
                "Not sure I agree, but interesting perspective.",
                "Any updates since you posted this?",
                "Just implemented this. Works perfectly!",
                "What about edge cases?",
                "The real MVP is whoever wrote the docs for this.",
                "Saving this for later.",
                "This is gold. Thank you!",
                "Have you tried the alternative approach?",
                "Nice writeup. Would love a follow-up on scaling.",
                "Simpler than I expected. Great explanation.",
                "Definitely going to use this.",
                "Bookmarked for my next project.",
                "Finally someone explained it clearly."
        };

        int commentCount = 0;
        for (Post post : posts) {
            int numComments = 2 + random.nextInt(6);
            List<Comment> topLevel = new ArrayList<>();

            for (int i = 0; i < numComments; i++) {
                Comment c = Comment.builder()
                        .content(commentTexts[random.nextInt(commentTexts.length)])
                        .author(users.get(random.nextInt(users.size())))
                        .post(post)
                        .parentComment(null)
                        .voteCount(random.nextInt(200) - 20)
                        .deleted(false)
                        .build();
                topLevel.add(commentRepository.save(c));
                commentCount++;

                // Some comments have replies
                if (random.nextBoolean()) {
                    int numReplies = 1 + random.nextInt(3);
                    for (int j = 0; j < numReplies; j++) {
                        Comment reply = Comment.builder()
                                .content(commentTexts[random.nextInt(commentTexts.length)])
                                .author(users.get(random.nextInt(users.size())))
                                .post(post)
                                .parentComment(c)
                                .voteCount(random.nextInt(100) - 10)
                                .deleted(false)
                                .build();
                        commentRepository.save(reply);
                        commentCount++;
                    }
                }
            }

            post.setCommentCount(numComments);
            postRepository.save(post);
        }
        log.info("✅ Created {} comments", commentCount);

        // ============== VOTES ==============
        int voteCount = 0;
        for (Post post : posts) {
            int numVotes = random.nextInt(20) + 5;
            Set<Long> votedUserIds = new HashSet<>();
            for (int i = 0; i < numVotes; i++) {
                User voter = users.get(random.nextInt(users.size()));
                if (votedUserIds.contains(voter.getId())) continue;
                votedUserIds.add(voter.getId());

                Vote.VoteType vt = random.nextDouble() > 0.25 ? Vote.VoteType.UPVOTE : Vote.VoteType.DOWNVOTE;
                Vote v = Vote.builder()
                        .user(voter)
                        .post(post)
                        .voteType(vt)
                        .build();
                voteRepository.save(v);
                voteCount++;
            }
        }
        log.info("✅ Created {} votes", voteCount);

        // ============== COMMUNITY MEMBERS ==============
        for (User u : users) {
            int numCommunities = 3 + random.nextInt(6);
            Set<Long> joined = new HashSet<>();
            for (int i = 0; i < numCommunities; i++) {
                Community c = communities.get(random.nextInt(communities.size()));
                if (joined.contains(c.getId())) continue;
                joined.add(c.getId());

                CommunityMember cm = CommunityMember.builder()
                        .user(u)
                        .community(c)
                        .role(CommunityMember.MemberRole.MEMBER)
                        .build();
                communityMemberRepository.save(cm);
            }
        }

        log.info("🎉 Database seeding complete!");
        log.info("📊 Login with any of: alice, bob, charlie, diana, eve, frank, grace, henry");
        log.info("🔑 Password: password123");
    }
}