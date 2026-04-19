// ─── Sample Job Data (in production this comes from the servlet/DB) ───────────
const jobs = [
  { id:1, title:"Senior Java Developer",    company:"TechCorp",      location:"New York, NY",  category:"IT",          type:"Full-time",  salary:"$90k–$120k",  tags:["Java","Spring Boot","REST"] },
  { id:2, title:"Frontend Developer",       company:"WebWorks",      location:"Remote",         category:"IT",          type:"Remote",     salary:"$70k–$95k",   tags:["React","CSS","JavaScript"] },
  { id:3, title:"Financial Analyst",        company:"FinGroup",      location:"Chicago, IL",    category:"Finance",     type:"Full-time",  salary:"$65k–$85k",   tags:["Excel","SQL","Finance"] },
  { id:4, title:"UX/UI Designer",           company:"PixelStudio",   location:"Austin, TX",     category:"Design",      type:"Full-time",  salary:"$60k–$80k",   tags:["Figma","Adobe XD","CSS"] },
  { id:5, title:"Data Scientist",           company:"DataMinds",     location:"San Francisco",  category:"IT",          type:"Full-time",  salary:"$100k–$140k", tags:["Python","ML","TensorFlow"] },
  { id:6, title:"Marketing Manager",        company:"BrandBoost",    location:"Los Angeles",    category:"Marketing",   type:"Full-time",  salary:"$55k–$75k",   tags:["SEO","Social Media","Analytics"] },
  { id:7, title:"Registered Nurse",         company:"CityHospital",  location:"Houston, TX",    category:"Healthcare",  type:"Full-time",  salary:"$60k–$80k",   tags:["Patient Care","EMR","ICU"] },
  { id:8, title:"Java Servlet Developer",   company:"EnterpriseApp", location:"Remote",         category:"IT",          type:"Remote",     salary:"$80k–$110k",  tags:["Java","Servlet","JSP","Tomcat"] },
  { id:9, title:"High School Teacher",      company:"Lincoln School", location:"Boston, MA",    category:"Education",   type:"Full-time",  salary:"$45k–$60k",   tags:["Teaching","Curriculum","STEM"] },
  { id:10,title:"Part-time Graphic Designer",company:"CreativeHub",  location:"Remote",         category:"Design",      type:"Part-time",  salary:"$25/hr",      tags:["Photoshop","Illustrator"] },
];

// ─── Render helpers ───────────────────────────────────────────────────────────
function jobCardHTML(job) {
  const tags = job.tags.map(t => `<span class="tag">${t}</span>`).join('');
  return `
    <div class="job-card">
      <h3>${job.title}</h3>
      <div class="company">${job.company}</div>
      <div class="meta">&#128205; ${job.location} &nbsp;|&nbsp; &#128197; ${job.type} &nbsp;|&nbsp; &#128176; ${job.salary}</div>
      <div>${tags}</div>
      <a href="login.html" class="btn" style="font-size:0.85rem; padding:8px 18px;">Apply Now</a>
    </div>`;
}

function renderFeaturedJobs() {
  const container = document.getElementById('featuredJobs');
  if (!container) return;
  container.innerHTML = jobs.slice(0, 6).map(jobCardHTML).join('');
}

function renderAllJobs(list) {
  const container = document.getElementById('jobList');
  if (!container) return;
  const data = list || jobs;
  container.innerHTML = data.length
    ? data.map(jobCardHTML).join('')
    : '<p style="color:#666;">No jobs found matching your criteria.</p>';
}

// ─── Search (hero) ────────────────────────────────────────────────────────────
function searchJobs() {
  const keyword  = document.getElementById('searchInput').value.toLowerCase();
  const location = document.getElementById('locationInput').value.toLowerCase();
  const params   = new URLSearchParams();
  if (keyword)  params.set('keyword', keyword);
  if (location) params.set('location', location);
  window.location.href = 'jobs.html?' + params.toString();
}

// ─── Filter (jobs page) ───────────────────────────────────────────────────────
function applyFilters() {
  const keyword  = document.getElementById('filterKeyword').value.toLowerCase();
  const category = document.getElementById('filterCategory').value;
  const type     = document.getElementById('filterType').value;

  const filtered = jobs.filter(j => {
    const matchKeyword  = !keyword  || j.title.toLowerCase().includes(keyword) || j.company.toLowerCase().includes(keyword);
    const matchCategory = !category || j.category === category;
    const matchType     = !type     || j.type === type;
    return matchKeyword && matchCategory && matchType;
  });
  renderAllJobs(filtered);
}

// ─── Category click (home page) ───────────────────────────────────────────────
function filterCategory(cat) {
  window.location.href = `jobs.html?category=${encodeURIComponent(cat)}`;
}

// ─── Auto-apply URL params on jobs page ──────────────────────────────────────
(function applyURLParams() {
  if (!document.getElementById('jobList')) return;
  const params   = new URLSearchParams(window.location.search);
  const keyword  = params.get('keyword')  || '';
  const location = params.get('location') || '';
  const category = params.get('category') || '';

  if (keyword)  document.getElementById('filterKeyword').value  = keyword;
  if (category) document.getElementById('filterCategory').value = category;

  const filtered = jobs.filter(j => {
    const matchKeyword   = !keyword  || j.title.toLowerCase().includes(keyword) || j.company.toLowerCase().includes(keyword);
    const matchLocation  = !location || j.location.toLowerCase().includes(location);
    const matchCategory  = !category || j.category === category;
    return matchKeyword && matchLocation && matchCategory;
  });
  renderAllJobs(filtered);
})();

// ─── Form: Post Job ───────────────────────────────────────────────────────────
function submitJob(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));

  // Client-side validation
  if (!data.title || !data.company || !data.location || !data.category || !data.type || !data.email) {
    showAlert('postAlert', 'Please fill in all required fields.', 'error');
    return;
  }

  /*
   * In production, replace this block with a real fetch to the servlet:
   *
   * fetch('JobServlet', {
   *   method: 'POST',
   *   body: new FormData(form)
   * }).then(res => res.text()).then(msg => showAlert('postAlert', msg, 'success'));
   */

  // Simulate success
  showAlert('postAlert', `Job "${data.title}" posted successfully! It will appear in listings shortly.`, 'success');
  form.reset();
}

// ─── Form: Register ───────────────────────────────────────────────────────────
function submitRegister(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));

  if (data.password !== data.confirmPassword) {
    showAlert('regAlert', 'Passwords do not match.', 'error');
    return;
  }

  /*
   * In production:
   * fetch('RegisterServlet', { method:'POST', body: new FormData(form) })
   *   .then(res => res.text()).then(msg => showAlert('regAlert', msg, 'success'));
   */

  showAlert('regAlert', `Account created for ${data.fullname}. Please login.`, 'success');
  form.reset();
}

// ─── Form: Login ──────────────────────────────────────────────────────────────
function submitLogin(e) {
  e.preventDefault();
  const form = e.target;
  const data = Object.fromEntries(new FormData(form));

  /*
   * In production:
   * fetch('LoginServlet', { method:'POST', body: new FormData(form) })
   *   .then(res => res.json())
   *   .then(result => {
   *     if (result.success) window.location.href = 'dashboard.html';
   *     else showAlert('loginAlert', result.message, 'error');
   *   });
   */

  // Demo: simple check
  if (data.email && data.password.length >= 8) {
    showAlert('loginAlert', `Welcome back! Redirecting...`, 'success');
    setTimeout(() => window.location.href = 'index.html', 1500);
  } else {
    showAlert('loginAlert', 'Invalid credentials. Please try again.', 'error');
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function showAlert(id, message, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  setTimeout(() => el.innerHTML = '', 5000);
}

// ─── Technical Training Data ──────────────────────────────────────────────────
const trainings = [
  {
    id: 1, category: 'cpp', icon: '⚙️',
    title: 'C++ Programming – Beginner to Advanced',
    desc: 'Master C++ from basics to OOP, STL, memory management, and competitive programming.',
    duration: '8 Weeks', level: 'beginner', accent: '#00897b',
    topics: ['Syntax & Data Types', 'OOP & Classes', 'Pointers & Memory', 'STL', 'File I/O']
  },
  {
    id: 2, category: 'cpp', icon: '🔧',
    title: 'C++ Data Structures & Algorithms',
    desc: 'Deep dive into arrays, linked lists, trees, graphs, sorting and searching algorithms in C++.',
    duration: '6 Weeks', level: 'intermediate', accent: '#f57c00',
    topics: ['Arrays & Strings', 'Linked Lists', 'Trees & Graphs', 'Sorting', 'Dynamic Programming']
  },
  {
    id: 3, category: 'cpp', icon: '🏆',
    title: 'Advanced C++ & System Programming',
    desc: 'Templates, multithreading, design patterns, and low-level system programming with C++.',
    duration: '10 Weeks', level: 'advanced', accent: '#c62828',
    topics: ['Templates', 'Multithreading', 'Design Patterns', 'Smart Pointers', 'Networking']
  },
  {
    id: 4, category: 'java', icon: '☕',
    title: 'Core Java & OOP',
    desc: 'Learn Java fundamentals, OOP principles, exception handling, and collections framework.',
    duration: '6 Weeks', level: 'beginner', accent: '#1565c0',
    topics: ['Java Basics', 'OOP', 'Collections', 'Exception Handling', 'Generics']
  },
  {
    id: 5, category: 'java', icon: '🌐',
    title: 'Java Servlets & JSP',
    desc: 'Build dynamic web applications using Java Servlets, JSP, JDBC, and Apache Tomcat.',
    duration: '5 Weeks', level: 'intermediate', accent: '#6a1b9a',
    topics: ['Servlets', 'JSP', 'JDBC', 'Session Management', 'MVC Pattern']
  },
  {
    id: 6, category: 'web', icon: '🖥️',
    title: 'Full Stack Web Development',
    desc: 'HTML, CSS, JavaScript, React on frontend and Node.js/Java on backend.',
    duration: '12 Weeks', level: 'beginner', accent: '#1a73e8',
    topics: ['HTML & CSS', 'JavaScript', 'React', 'REST APIs', 'Deployment']
  },
  {
    id: 7, category: 'data', icon: '📊',
    title: 'Data Science with Python',
    desc: 'Python, Pandas, NumPy, data visualization, and machine learning fundamentals.',
    duration: '10 Weeks', level: 'intermediate', accent: '#2e7d32',
    topics: ['Python', 'Pandas & NumPy', 'Matplotlib', 'Scikit-learn', 'ML Models']
  },
  {
    id: 8, category: 'db', icon: '🗄️',
    title: 'SQL & Database Design',
    desc: 'Relational databases, SQL queries, normalization, stored procedures, and MySQL/PostgreSQL.',
    duration: '4 Weeks', level: 'beginner', accent: '#00838f',
    topics: ['SQL Basics', 'Joins & Subqueries', 'Normalization', 'Stored Procedures', 'Indexing']
  },
];

// ─── Render Training Cards ────────────────────────────────────────────────────
function renderTraining(list) {
  const grid = document.getElementById('trainingGrid');
  if (!grid) return;

  grid.innerHTML = list.map(t => {
    const levelClass = { beginner: 'level-beginner', intermediate: 'level-intermediate', advanced: 'level-advanced' }[t.level];
    const levelLabel = t.level.charAt(0).toUpperCase() + t.level.slice(1);
    const topicTags  = t.topics.map(tp => `<span class="tag">${tp}</span>`).join('');

    return `
      <div class="training-card" style="--accent:${t.accent}">
        <div class="t-icon">${t.icon}</div>
        <h3>${t.title}</h3>
        <p>${t.desc}</p>
        <div>${topicTags}</div>
        <div class="t-meta">
          <span>⏱ ${t.duration}</span>
          <span class="level-badge ${levelClass}">${levelLabel}</span>
        </div>
        <a href="training.html" class="btn-sm">Enroll Now</a>
      </div>`;
  }).join('');
}

function filterTraining(cat, btn) {
  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const filtered = cat === 'all' ? trainings : trainings.filter(t => t.category === cat);
  renderTraining(filtered);
}

// Auto-render on page load
if (document.getElementById('trainingGrid')) {
  renderTraining(trainings);
}
