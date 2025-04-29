
export interface Resource {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
  content: string;
  videoUrl?: string;
  pdfUrl?: string;
  practiceQuestions?: {
    question: string;
    answer: string;
  }[];
  companyQuestions?: {
    company: string;
    questions: string[];
  }[];
  additionalLinks?: {
    title: string;
    url: string;
  }[];
}

export interface Subtopic {
  id: string;
  title: string;
  description: string;
  image: string;
  resources: Resource[];
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  subtopics: Subtopic[];
}

const resourcesData: Category[] = [
  {
    id: "technical",
    title: "Technical Skills",
    description: "Core programming and technical concepts to ace technical interviews",
    icon: "code",
    color: "blue",
    subtopics: [
      {
        id: "data-structures",
        title: "Data Structures",
        description: "Master essential data structures for coding interviews",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000",
        resources: [
          {
            id: "arrays-lists",
            title: "Arrays and Linked Lists",
            description: "Understanding the fundamentals of arrays and linked lists",
            keyPoints: [
              "Arrays provide constant-time access but fixed size",
              "Linked lists allow dynamic size but linear-time access",
              "Time complexity differences for common operations",
              "When to use arrays vs linked lists"
            ],
            content: `
# Arrays and Linked Lists

Arrays and linked lists are fundamental data structures used in programming. They serve similar purposes but have different performance characteristics.

## Arrays
Arrays store elements in contiguous memory locations, allowing for constant-time access to any element using its index. However, they typically have a fixed size, making insertions and deletions potentially expensive operations if they require resizing or shifting elements.

### Advantages:
- Constant-time access to elements (O(1))
- Cache-friendly due to memory locality
- Low memory overhead per element

### Disadvantages:
- Fixed size in many languages
- Insertions and deletions are O(n) in the worst case
- Resizing can be expensive

## Linked Lists
Linked lists store elements as separate objects (nodes) with pointers to the next (and sometimes previous) node. This allows for efficient insertions and deletions but sacrifices random access efficiency.

### Advantages:
- Dynamic size
- Efficient insertions and deletions (O(1) when position is known)
- No need for contiguous memory

### Disadvantages:
- Linear-time access to elements (O(n))
- Higher memory overhead due to storage of pointers
- Not cache-friendly

## Choosing Between Arrays and Linked Lists
- Use arrays when you need frequent random access and infrequent insertions/deletions
- Use linked lists when you need frequent insertions/deletions and sequential access is sufficient
            `,
            videoUrl: "https://www.youtube.com/embed/6JeuJRqKJrI",
            pdfUrl: "https://example.com/arrays-linked-lists.pdf",
            practiceQuestions: [
              {
                question: "What is the time complexity of accessing an element in an array by index?",
                answer: "O(1) - constant time"
              },
              {
                question: "What is the time complexity of inserting an element at the beginning of a linked list?",
                answer: "O(1) - constant time"
              },
              {
                question: "When would you prefer using a linked list over an array?",
                answer: "When you need frequent insertions and deletions, especially at the beginning or middle of the collection, and don't need random access."
              }
            ],
            companyQuestions: [
              {
                company: "Google",
                questions: [
                  "Implement a function to reverse a singly linked list.",
                  "Given an array, find the maximum subarray sum (Kadane's algorithm)."
                ]
              },
              {
                company: "Amazon",
                questions: [
                  "Detect if a linked list has a cycle.",
                  "Merge two sorted arrays efficiently."
                ]
              }
            ],
            additionalLinks: [
              {
                title: "GeeksforGeeks: Array Data Structure",
                url: "https://www.geeksforgeeks.org/array-data-structure/"
              },
              {
                title: "GeeksforGeeks: Linked List Data Structure",
                url: "https://www.geeksforgeeks.org/data-structures/linked-list/"
              }
            ]
          },
          {
            id: "trees-graphs",
            title: "Trees and Graphs",
            description: "Advanced data structures for complex relationship modeling",
            keyPoints: [
              "Tree terminology and properties",
              "Binary search trees and balancing",
              "Graph representations (adjacency list/matrix)",
              "Common tree and graph algorithms"
            ],
            content: `
# Trees and Graphs

Trees and graphs are advanced data structures that model relationships between data. They're essential for solving complex computational problems.

## Trees
A tree is a hierarchical data structure consisting of nodes connected by edges. Each tree has a root node, and every node (except the root) has exactly one parent node.

### Key Tree Types:
- **Binary Tree**: Each node has at most two children
- **Binary Search Tree (BST)**: Left child < parent < right child
- **Balanced Trees**: AVL trees, Red-Black trees, etc.
- **Heap**: Complete binary tree with heap property

### Tree Traversals:
- **In-order**: Left, Root, Right
- **Pre-order**: Root, Left, Right
- **Post-order**: Left, Right, Root
- **Level-order**: Level by level from top to bottom

## Graphs
A graph consists of vertices (nodes) and edges connecting pairs of vertices. Graphs can model complex relationships where data isn't hierarchical.

### Graph Types:
- **Directed vs. Undirected**
- **Weighted vs. Unweighted**
- **Cyclic vs. Acyclic**
- **Connected vs. Disconnected**

### Graph Representations:
- **Adjacency Matrix**: 2D array where cell [i][j] indicates edge between i and j
- **Adjacency List**: Array of lists where each list contains neighbors of a vertex

### Graph Algorithms:
- **Breadth-First Search (BFS)**: Uses queue, explores neighbors first
- **Depth-First Search (DFS)**: Uses stack/recursion, explores as far as possible
- **Dijkstra's Algorithm**: Finds shortest paths in weighted graphs
- **Minimum Spanning Tree Algorithms**: Kruskal's, Prim's
`,
            videoUrl: "https://www.youtube.com/embed/oSWTXtMglKE",
            pdfUrl: "https://example.com/trees-graphs.pdf",
            practiceQuestions: [
              {
                question: "What is the time complexity of searching in a balanced binary search tree?",
                answer: "O(log n)"
              },
              {
                question: "What algorithms can be used to find the shortest path in an unweighted graph?",
                answer: "Breadth-First Search (BFS)"
              }
            ],
            companyQuestions: [
              {
                company: "Facebook",
                questions: [
                  "Implement a function to check if a binary tree is balanced.",
                  "Find the shortest path between two nodes in a graph."
                ]
              },
              {
                company: "Microsoft",
                questions: [
                  "Serialize and deserialize a binary tree.",
                  "Detect a cycle in a directed graph."
                ]
              }
            ],
            additionalLinks: [
              {
                title: "Visualgo: Tree Visualizations",
                url: "https://visualgo.net/en/bst"
              },
              {
                title: "Visualgo: Graph Algorithms",
                url: "https://visualgo.net/en/graphds"
              }
            ]
          }
        ]
      },
      {
        id: "algorithms",
        title: "Algorithms",
        description: "Learn essential algorithms for problem-solving",
        image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1000",
        resources: [
          {
            id: "searching-sorting",
            title: "Searching and Sorting Algorithms",
            description: "Understanding different searching and sorting techniques",
            keyPoints: [
              "Binary search for efficient searching in sorted arrays",
              "Merge sort, quick sort, and heap sort implementations",
              "Time and space complexity analysis",
              "Stability in sorting algorithms"
            ],
            content: `
# Searching and Sorting Algorithms

Searching and sorting are fundamental operations in computer science, forming the basis for many complex algorithms.

## Searching Algorithms

### Linear Search
- **Time Complexity**: O(n)
- **Description**: Sequentially checks each element until the target is found
- **Best for**: Small or unsorted data sets

### Binary Search
- **Time Complexity**: O(log n)
- **Description**: Divides the search space in half each time
- **Requirements**: Data must be sorted
- **Implementation**:
\`\`\`
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1; // Not found
}
\`\`\`

## Sorting Algorithms

### Bubble Sort
- **Time Complexity**: O(n²)
- **Space Complexity**: O(1)
- **Stability**: Stable
- **Description**: Repeatedly steps through the list, compares adjacent elements, and swaps them if needed

### Merge Sort
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(n)
- **Stability**: Stable
- **Description**: Divides the array into halves, sorts each half, and then merges them
- **Advantage**: Guaranteed O(n log n) performance

### Quick Sort
- **Time Complexity**: O(n log n) average, O(n²) worst case
- **Space Complexity**: O(log n)
- **Stability**: Not stable
- **Description**: Selects a 'pivot' element and partitions the array around it
- **Advantage**: Often faster in practice than other O(n log n) algorithms

### Heap Sort
- **Time Complexity**: O(n log n)
- **Space Complexity**: O(1)
- **Stability**: Not stable
- **Description**: Builds a heap from the data and repeatedly extracts the maximum element

## Choosing the Right Algorithm

| Algorithm | Time Complexity | Space | Stable | Best Use Case |
|-----------|-----------------|-------|--------|--------------|
| Bubble Sort | O(n²) | O(1) | Yes | Small data sets, teaching |
| Insertion Sort | O(n²) | O(1) | Yes | Small or nearly sorted data |
| Merge Sort | O(n log n) | O(n) | Yes | Guaranteed performance needs |
| Quick Sort | O(n log n) avg | O(log n) | No | General purpose, in-memory sorting |
| Heap Sort | O(n log n) | O(1) | No | Memory-constrained environments |
`,
            videoUrl: "https://www.youtube.com/embed/kPRA0W1kECg",
            pdfUrl: "https://example.com/searching-sorting.pdf",
            practiceQuestions: [
              {
                question: "What is the time complexity of binary search?",
                answer: "O(log n)"
              },
              {
                question: "Which sorting algorithm is guaranteed to have O(n log n) time complexity in all cases?",
                answer: "Merge sort"
              }
            ],
            companyQuestions: [
              {
                company: "Google",
                questions: [
                  "Implement merge sort without using extra space.",
                  "Find the kth largest element in an unsorted array."
                ]
              },
              {
                company: "Microsoft",
                questions: [
                  "Implement binary search in a rotated sorted array.",
                  "Sort an array of 0s, 1s, and 2s (Dutch National Flag problem)."
                ]
              }
            ],
            additionalLinks: [
              {
                title: "Visualgo: Sorting Visualizations",
                url: "https://visualgo.net/en/sorting"
              },
              {
                title: "TopCoder: Sorting Algorithms",
                url: "https://www.topcoder.com/thrive/articles/Sorting"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "aptitude",
    title: "Aptitude",
    description: "Quantitative and logical reasoning questions for aptitude tests",
    icon: "brain",
    color: "green",
    subtopics: [
      {
        id: "quantitative",
        title: "Quantitative Aptitude",
        description: "Essential numerical and mathematical skills",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1000",
        resources: [
          {
            id: "number-series",
            title: "Number Series",
            description: "Identifying patterns in number sequences",
            keyPoints: [
              "Arithmetic progression series",
              "Geometric progression series",
              "Mixed series patterns",
              "Shortcut techniques"
            ],
            content: `
# Number Series

Number series questions test your ability to identify patterns in sequences of numbers. They're common in aptitude tests for many tech companies.

## Types of Number Series

### Arithmetic Progression (AP)
- Each term differs from the previous by a constant value (common difference)
- Formula: a_n = a + (n-1)d
  - a = first term
  - d = common difference
  - n = position in sequence
- Example: 2, 5, 8, 11, 14, ...
  - Common difference = 3

### Geometric Progression (GP)
- Each term is multiplied by a constant value (common ratio)
- Formula: a_n = a * r^(n-1)
  - a = first term
  - r = common ratio
  - n = position in sequence
- Example: 3, 6, 12, 24, 48, ...
  - Common ratio = 2

### Mixed Series
- Combination of patterns or alternating patterns
- Example: 3, 4, 7, 11, 18, 29, ...
  - Difference: 1, 3, 4, 7, 11, ...
  - Notice the Fibonacci-like pattern (each difference is the sum of the previous two differences)

## Solving Strategies

1. **Calculate the differences** between consecutive terms
2. If differences are constant, it's an AP
3. If differences form another pattern, calculate second-level differences
4. For GPs, divide each term by the previous term to check for a constant ratio

## Practice Approach

1. Look for basic patterns first: +2, +3, ×2, ×3, etc.
2. Check if alternate terms follow a pattern
3. Try combining operations: ×2+1, +3×2, etc.
4. For complex series, check if terms follow formulas like n², 2ⁿ, n!

## Common Tricks

- Square/cube numbers: 1, 4, 9, 16, 25, ... or 1, 8, 27, 64, ...
- Prime numbers: 2, 3, 5, 7, 11, 13, ...
- Fibonacci: 0, 1, 1, 2, 3, 5, 8, 13, ...
- Triangular numbers: 1, 3, 6, 10, 15, ...
`,
            videoUrl: "https://www.youtube.com/embed/Kj7QoEh48y8",
            pdfUrl: "https://example.com/number-series.pdf",
            practiceQuestions: [
              {
                question: "Find the next number in the series: 2, 6, 12, 20, 30, ?",
                answer: "42 (difference increases by 2 each time: 4, 6, 8, 10, 12)"
              },
              {
                question: "What comes next: 1, 4, 9, 16, 25, ?",
                answer: "36 (these are square numbers: 1², 2², 3², 4², 5², 6²)"
              }
            ],
            companyQuestions: [
              {
                company: "Infosys",
                questions: [
                  "Find the next number: 1, 5, 14, 30, 55, ?",
                  "Complete the series: 0, 6, 24, 60, 120, ?"
                ]
              },
              {
                company: "TCS",
                questions: [
                  "Find the missing number: 3, 7, 15, 31, 63, ?",
                  "What comes next: 1, 4, 13, 40, 121, ?"
                ]
              }
            ],
            additionalLinks: [
              {
                title: "IndiaBIX: Number Series Questions",
                url: "https://www.indiabix.com/aptitude/number-series/"
              },
              {
                title: "Career Ride: Number Series Tutorial",
                url: "https://www.careerride.com/Aptitude-Number-Series.aspx"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "verbal",
    title: "Verbal Skills",
    description: "English communication and reasoning skills",
    icon: "speech",
    color: "purple",
    subtopics: [
      {
        id: "reading-comprehension",
        title: "Reading Comprehension",
        description: "Techniques to analyze and understand written passages",
        image: "https://plus.unsplash.com/premium_photo-1664304264871-a30559e12719?q=80&w=1000",
        resources: [
          {
            id: "comprehension-strategies",
            title: "Comprehension Strategies",
            description: "Effective approaches for comprehending complex passages",
            keyPoints: [
              "Active reading techniques",
              "Identifying main ideas and supporting details",
              "Understanding inference and tone",
              "Speed reading while maintaining comprehension"
            ],
            content: `
# Reading Comprehension Strategies

Reading comprehension is a critical skill for technical assessments, interviews, and professional communication. This resource covers effective strategies to improve your comprehension of complex passages.

## Active Reading Approach

Active reading involves engaging with the text rather than passively consuming it. Key techniques include:

1. **Preview the text** - Scan headings, bold text, and introductory/concluding paragraphs
2. **Ask questions** while reading - What is the author's main point? What evidence supports it?
3. **Annotate the text** - Highlight key points, write questions in margins
4. **Summarize sections** in your own words
5. **Review and reflect** after finishing

## Identifying Structure

Understanding the organization of a passage helps comprehension:

- **Main idea** - Usually found in topic sentences (often first or last sentence of paragraphs)
- **Supporting details** - Examples, statistics, anecdotes that back up main ideas
- **Transitions** - Words like "however," "therefore," "consequently" that show relationships between ideas

## Types of Passages

Different passages require different approaches:

| Passage Type | Focus On |
|--------------|----------|
| Narrative | Characters, plot, setting, conflict |
| Expository | Main ideas, supporting evidence, organization |
| Persuasive | Claims, evidence, rhetorical devices |
| Technical | Definitions, processes, cause-effect relationships |

## Handling Difficult Questions

1. **Inference questions** - Look for clues in text but don't overreach; answers should be strongly supported
2. **Vocabulary in context** - Use surrounding sentences for clues
3. **Author's tone** - Note emotional language, point of view markers
4. **Purpose questions** - Consider why the author wrote the passage (inform, persuade, entertain)

## Speed Reading Techniques

1. **Chunking** - Read groups of words rather than individual words
2. **Skimming** - Quick reading for main ideas
3. **Scanning** - Searching for specific information
4. **Avoiding subvocalization** - Reducing the habit of pronouncing words in your head
`,
            videoUrl: "https://www.youtube.com/embed/WgbG5lo5Usg",
            pdfUrl: "https://example.com/comprehension-strategies.pdf",
            practiceQuestions: [
              {
                question: "What is the difference between skimming and scanning?",
                answer: "Skimming is reading quickly to get the main ideas, while scanning is searching for specific information or keywords."
              },
              {
                question: "What should you focus on when identifying the author's tone?",
                answer: "Look for emotional language, word choice, point of view markers, and the overall attitude the author conveys toward the subject."
              }
            ],
            companyQuestions: [
              {
                company: "Amazon",
                questions: [
                  "Read a technical document and summarize the key points in 2-3 sentences.",
                  "Identify the main argument and counterarguments in a given passage."
                ]
              },
              {
                company: "Deloitte",
                questions: [
                  "Read a business case and identify the primary problems and potential solutions.",
                  "Analyze a company memo and explain the implications for different stakeholders."
                ]
              }
            ],
            additionalLinks: [
              {
                title: "MindTools: Effective Reading",
                url: "https://www.mindtools.com/rdstratg.html"
              },
              {
                title: "Harvard Business Review: How to Read a Book a Week",
                url: "https://hbr.org/2016/02/how-to-read-a-book-a-week"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "interview-prep",
    title: "Interview Preparation",
    description: "Strategies and techniques for acing technical interviews",
    icon: "users",
    color: "orange",
    subtopics: [
      {
        id: "behavioral",
        title: "Behavioral Interviews",
        description: "Techniques for answering behavioral questions effectively",
        image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000",
        resources: [
          {
            id: "star-method",
            title: "The STAR Method",
            description: "Structured approach to answering behavioral questions",
            keyPoints: [
              "Situation: Set the context",
              "Task: Describe your responsibility",
              "Action: Explain what you did",
              "Result: Share the outcomes"
            ],
            content: `
# The STAR Method for Behavioral Interviews

The STAR method is a structured way to respond to behavioral interview questions. It helps you provide concrete examples of your skills and experiences in a compelling, concise format.

## What is the STAR Method?

STAR stands for:

- **Situation**: The context or background for your example
- **Task**: Your specific responsibility or challenge in that situation
- **Action**: The steps you took to address the task
- **Result**: The outcomes of your actions, preferably with metrics

## Why Use the STAR Method?

- Provides a clear structure for your answers
- Ensures you include all relevant details
- Helps you avoid rambling
- Makes your examples more impactful
- Demonstrates your analytical thinking

## How to Use the STAR Method

### Step 1: Situation
Set the scene by providing context:
- When and where did this happen?
- What was the general environment or challenge?
- Keep it concise but informative

Example: "In my previous role at Tech Corp, our team was facing a critical deadline for our product launch, but we were experiencing significant bugs in our codebase."

### Step 2: Task
Explain your specific responsibility:
- What was your role?
- What were you asked to do?
- What were the expectations?

Example: "As the lead developer, I was responsible for identifying the source of the bugs and developing a strategy to fix them without delaying our launch."

### Step 3: Action
Detail the specific actions you took:
- What did you do step by step?
- Why did you choose that approach?
- Highlight your skills and thinking process
- Use "I" statements, not "we" (focus on your contribution)

Example: "I first implemented a systematic debugging process. I organized the team into specialized units focusing on different parts of the codebase. I personally took on the most complex issues and created a prioritization framework based on impact and complexity. I also established twice-daily stand-ups to track progress and remove blockers quickly."

### Step 4: Result
Share the outcomes:
- What happened as a result of your actions?
- Quantify the impact when possible
- Include what you learned if relevant
- If the outcome wasn't positive, explain what you learned and how you'd approach it differently now

Example: "Through this approach, we identified and fixed all critical bugs three days ahead of our deadline. The product launched successfully with a 97% stability rate, compared to our previous average of 82%. The debugging framework I created was later adopted as a standard process for all teams."

## Common Behavioral Question Topics

| Topic | Example Question | STAR Focus |
|-------|------------------|------------|
| Leadership | Tell me about a time you led a team through a difficult situation | Emphasize decision-making and team motivation |
| Problem-solving | Describe a complex problem you solved | Highlight analytical approach and creativity |
| Conflict | Tell me about a time you handled a disagreement | Focus on communication and resolution skills |
| Failure | Describe a time you failed | Emphasize learning and growth |
| Initiative | When have you gone above and beyond? | Showcase proactivity and results |
`,
            videoUrl: "https://www.youtube.com/embed/8GhRiTjCNm0",
            pdfUrl: "https://example.com/star-method.pdf",
            practiceQuestions: [
              {
                question: "Tell me about a time when you disagreed with a team member. How did you resolve it?",
                answer: "Use the STAR method: Describe the situation, your task/role, the specific actions you took to resolve the disagreement, and the positive result of your approach."
              },
              {
                question: "Describe a time when you failed to meet a deadline. What happened and what did you learn?",
                answer: "Apply STAR: Explain the situation that led to missing the deadline, your responsibilities, the actions you took (even though unsuccessful), and most importantly, the results in terms of what you learned and how you've improved since then."
              }
            ],
            companyQuestions: [
              {
                company: "Amazon",
                questions: [
                  "Tell me about a time when you made a difficult decision to sacrifice short term goals for long term success.",
                  "Give me an example of a time when you did not meet a client's expectation. What happened, and how did you attempt to rectify the situation?"
                ]
              },
              {
                company: "Google",
                questions: [
                  "Describe a situation where you had to work with a difficult team member.",
                  "Tell me about a time when you had to make a decision with incomplete information."
                ]
              }
            ],
            additionalLinks: [
              {
                title: "Indeed: STAR Interview Response Technique",
                url: "https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique"
              },
              {
                title: "Harvard Business Review: How to Answer Behavioral Interview Questions",
                url: "https://hbr.org/2022/05/how-to-answer-behavioral-interview-questions"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "company-prep",
    title: "Company-Specific Preparation",
    description: "Targeted preparation for major tech companies",
    icon: "building",
    color: "red",
    subtopics: [
      {
        id: "faang",
        title: "FAANG Companies",
        description: "Specific preparation for Facebook, Amazon, Apple, Netflix, and Google",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000",
        resources: [
          {
            id: "google-interview",
            title: "Google Interview Guide",
            description: "Comprehensive preparation for Google's interview process",
            keyPoints: [
              "Understanding Google's interview structure",
              "Technical preparation focus areas",
              "Behavioral questions and Google's culture fit",
              "Tips from successful candidates"
            ],
            content: `
# Google Interview Preparation Guide

Google's interview process is known for its thoroughness and focus on problem-solving abilities. This guide will help you understand what to expect and how to prepare effectively.

## Google's Interview Process

1. **Resume Screening**
2. **Phone Screening** (1-2 rounds)
   - Technical questions
   - Brief background discussion
3. **Onsite Interviews** (4-5 rounds)
   - Coding interviews
   - System design (for senior roles)
   - Behavioral interviews
   - Team-specific interviews
4. **Hiring Committee Review**
5. **Offer Stage**

## Technical Preparation

### Coding Interview Focus

Google places heavy emphasis on:

- **Data Structures**: Arrays, strings, linked lists, trees, graphs, heaps
- **Algorithms**: Sorting, searching, recursion, dynamic programming
- **Problem-Solving Approach**: How you think through problems is as important as solving them

### System Design (for Senior Roles)

- Scalability considerations
- Microservices architecture
- Google-scale challenges
- Trade-off analysis

### Best Practices

1. **Practice coding on a whiteboard** or Google Docs (without code completion)
2. **Explain your thought process** while solving problems
3. **Ask clarifying questions** before diving into solutions
4. **Test your code** thoroughly
5. **Analyze time and space complexity**
6. **Consider edge cases**

## Behavioral Preparation

Google evaluates candidates on four key areas:

1. **General Cognitive Ability**: How you solve problems
2. **Leadership**: Taking initiative and supporting teams
3. **Googleyness**: Culture fit with Google's values
4. **Role-Related Knowledge**: Technical expertise for your specific role

### Common Behavioral Questions

- "Tell me about a time when you faced a problem that had multiple solutions."
- "Describe a situation where you disagreed with a team member. How did you resolve it?"
- "How do you keep your technical skills current?"
- "Give an example of how you've worked on a particularly challenging project."

## Google-Specific Tips

1. **Understand Google's Products**: Be familiar with Google's ecosystem
2. **Review Google's Leadership Principles**: Innovation, user focus, data-driven decisions
3. **Prepare Your "Googleyness"**: Show how you align with Google's culture
4. **Focus on Impact**: Google values candidates who can drive meaningful impact

## Resources Recommended by Google Engineers

1. **"Cracking the Coding Interview"** by Gayle Laakmann McDowell
2. **LeetCode** (focus on medium and hard problems)
3. **HackerRank**
4. **Google's Tech Dev Guide**: https://techdevguide.withgoogle.com/
5. **System Design Primer** (for senior roles)

## Week-by-Week Preparation Plan

### Week 1-2: Foundations
- Review data structures and algorithms
- Practice easy problems on LeetCode
- Read about Google's culture and interview process

### Week 3-4: Intermediate
- Practice medium difficulty problems
- Mock interviews with peers
- Deepen system design knowledge (if applicable)

### Week 5-6: Advanced
- Tackle hard problems
- Full-length mock interviews
- Refine behavioral stories using the STAR method

### Final Week
- Light review
- Rest and mental preparation
- Last-minute logistics planning
`,
            videoUrl: "https://www.youtube.com/embed/XKu_SEDAykw",
            pdfUrl: "https://example.com/google-interview.pdf",
            practiceQuestions: [
              {
                question: "What are the four key areas Google evaluates candidates on?",
                answer: "General Cognitive Ability, Leadership, Googleyness (culture fit), and Role-Related Knowledge."
              },
              {
                question: "What is the typical structure of Google's interview process?",
                answer: "Resume screening, phone screening (1-2 rounds), onsite interviews (4-5 rounds), hiring committee review, and offer stage."
              }
            ],
            companyQuestions: [
              {
                company: "Google",
                questions: [
                  "Implement a function to find the longest substring without repeating characters.",
                  "Design a notification system for YouTube that can handle millions of users.",
                  "Tell me about a time when you had to learn something quickly to solve a problem.",
                  "How would you improve Google Search?"
                ]
              }
            ],
            additionalLinks: [
              {
                title: "Google Careers: How We Hire",
                url: "https://careers.google.com/how-we-hire/"
              },
              {
                title: "Google Tech Dev Guide",
                url: "https://techdevguide.withgoogle.com/"
              }
            ]
          }
        ]
      }
    ]
  }
];

export default resourcesData;
