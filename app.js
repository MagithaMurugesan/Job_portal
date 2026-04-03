"use strict";
const jobs = [
    { id: 1, title: "Frontend Developer", company: "NovaTech", salary: "$72k - $94k", location: "Bengaluru, India", role: "Engineering" },
    { id: 2, title: "Product Designer", company: "PixelCraft", salary: "$68k - $88k", location: "Remote", role: "Design" },
    { id: 3, title: "Data Analyst", company: "InsightLoop", salary: "$64k - $84k", location: "Hyderabad, India", role: "Data" },
    { id: 4, title: "Growth Marketer", company: "BrightLabs", salary: "$58k - $79k", location: "Mumbai, India", role: "Marketing" },
    { id: 5, title: "Backend Engineer", company: "NovaTech", salary: "$82k - $110k", location: "Pune, India", role: "Engineering" },
    { id: 6, title: "Product Manager", company: "CloudPeak", salary: "$90k - $120k", location: "Remote", role: "Product" },
    { id: 7, title: "UI Designer", company: "UrbanHive", salary: "$60k - $80k", location: "Chennai, India", role: "Design" },
    { id: 8, title: "Machine Learning Engineer", company: "InsightLoop", salary: "$98k - $132k", location: "Delhi, India", role: "Data" }
];
const filters = {
    search: "",
    company: "All",
    role: "All"
};
const savedJobIds = new Set();
const searchInput = document.querySelector("#search-input");
const companyFilter = document.querySelector("#company-filter");
const roleFilter = document.querySelector("#role-filter");
const clearFiltersButton = document.querySelector("#clear-filters");
const jobList = document.querySelector("#job-list");
const savedJobs = document.querySelector("#saved-jobs");
const resultsSummary = document.querySelector("#results-summary");
const jobCount = document.querySelector("#job-count");
const savedCount = document.querySelector("#saved-count");
if (!searchInput ||
    !companyFilter ||
    !roleFilter ||
    !clearFiltersButton ||
    !jobList ||
    !savedJobs ||
    !resultsSummary ||
    !jobCount ||
    !savedCount) {
    throw new Error("Job portal UI failed to initialize.");
}
function getInitials(company) {
    return company
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}
function populateFilters() {
    const companies = ["All", ...new Set(jobs.map((job) => job.company))];
    const roles = ["All", ...new Set(jobs.map((job) => job.role))];
    companyFilter.innerHTML = companies
        .map((company) => `<option value="${company}">${company === "All" ? "All Companies" : company}</option>`)
        .join("");
    roleFilter.innerHTML = roles
        .map((role) => `<option value="${role}">${role === "All" ? "All Roles" : role}</option>`)
        .join("");
}
function getFilteredJobs() {
    const query = filters.search.trim().toLowerCase();
    return jobs.filter((job) => {
        const matchesSearch = query.length === 0 ||
            [job.title, job.company, job.location, job.role]
                .join(" ")
                .toLowerCase()
                .includes(query);
        const matchesCompany = filters.company === "All" || job.company === filters.company;
        const matchesRole = filters.role === "All" || job.role === filters.role;
        return matchesSearch && matchesCompany && matchesRole;
    });
}
function createEmptyState(message) {
    return `<div class="empty-state">${message}</div>`;
}
function renderJobs() {
    const filteredJobs = getFilteredJobs();
    resultsSummary.textContent = `${filteredJobs.length} job${filteredJobs.length === 1 ? "" : "s"} match your filters`;
    jobCount.textContent = String(jobs.length);
    if (filteredJobs.length === 0) {
        jobList.innerHTML = createEmptyState("No jobs found. Try a different keyword or filter combination.");
        return;
    }
    jobList.innerHTML = filteredJobs
        .map((job) => {
        const isSaved = savedJobIds.has(job.id);
        return `
        <article class="job-card">
          <div class="job-card__top">
            <div class="logo-badge" aria-hidden="true">${getInitials(job.company)}</div>
            <span class="tag">${job.role}</span>
          </div>
          <h3>${job.title}</h3>
          <p class="job-card__company">${job.company}</p>
          <div class="job-card__meta">
            <span>Salary: ${job.salary}</span>
            <span>Location: ${job.location}</span>
          </div>
          <button class="button button--save ${isSaved ? "button--saved" : ""}" type="button" data-job-id="${job.id}">
            ${isSaved ? "Saved" : "Save Job"}
          </button>
        </article>
      `;
    })
        .join("");
}
function renderSavedJobs() {
    const savedJobsData = jobs.filter((job) => savedJobIds.has(job.id));
    savedCount.textContent = String(savedJobsData.length);
    if (savedJobsData.length === 0) {
        savedJobs.innerHTML = createEmptyState("Your bookmarked jobs will appear here.");
        return;
    }
    savedJobs.innerHTML = savedJobsData
        .map((job) => `
        <article class="saved-job">
          <h3>${job.title}</h3>
          <p class="saved-job__company">${job.company}</p>
          <div class="saved-job__meta">
            <span>${job.salary}</span>
            <span>${job.location}</span>
          </div>
          <div class="saved-job__actions">
            <button class="button button--remove" type="button" data-remove-id="${job.id}">Remove</button>
          </div>
        </article>
      `)
        .join("");
}
function updateUI() {
    renderJobs();
    renderSavedJobs();
}
searchInput.addEventListener("input", (event) => {
    filters.search = event.target.value;
    renderJobs();
});
companyFilter.addEventListener("change", (event) => {
    filters.company = event.target.value;
    renderJobs();
});
roleFilter.addEventListener("change", (event) => {
    filters.role = event.target.value;
    renderJobs();
});
clearFiltersButton.addEventListener("click", () => {
    filters.search = "";
    filters.company = "All";
    filters.role = "All";
    searchInput.value = "";
    companyFilter.value = "All";
    roleFilter.value = "All";
    renderJobs();
});
jobList.addEventListener("click", (event) => {
    const target = event.target;
    const button = target.closest("[data-job-id]");
    if (!button) {
        return;
    }
    const jobId = Number(button.dataset.jobId);
    if (savedJobIds.has(jobId)) {
        savedJobIds.delete(jobId);
    }
    else {
        savedJobIds.add(jobId);
    }
    updateUI();
});
savedJobs.addEventListener("click", (event) => {
    const target = event.target;
    const button = target.closest("[data-remove-id]");
    if (!button) {
        return;
    }
    const jobId = Number(button.dataset.removeId);
    savedJobIds.delete(jobId);
    updateUI();
});
populateFilters();
updateUI();
