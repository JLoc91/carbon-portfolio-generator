import { Project, ProjectRaw } from "./types/types";

export const generatePortfolioByCarbonCreditsDemand = (
  carbonCreditsDemand: number,
  projects: Project[]
) => {
  const initiallyDistributedPortfolio = initialDistribution(
    carbonCreditsDemand,
    projects
  );
  if (
    initiallyDistributedPortfolio.filter(
      (project) =>
        (project.invested_carbon_credits ?? 0) > project.offered_volume_in_tons
    ).length > 0
  ) {
    console.log("At least one project with tonnage more than offered volume");
    return redistributePortfolio(initiallyDistributedPortfolio);
  }

  if (
    initiallyDistributedPortfolio.some(
      (project) => !Number.isInteger(project.invested_carbon_credits)
    )
  ) {
    initiallyDistributedPortfolio.map((project) => ({
      ...projects,
      invested_carbon_credits: Math.floor(project.invested_carbon_credits ?? 0),
    }));
  }
  return initiallyDistributedPortfolio;
};

const initialDistribution = (
  carbonCreditsDemand: number,
  projects: Project[]
) => {
  return projects.map((project) => ({
    ...project,
    invested_carbon_credits: project.distribution_weight * carbonCreditsDemand,
  }));
};

const newDistribution = (carbonCreditsDemand: number, projects: Project[]) => {
  return projects.map((project) => ({
    ...project,
    invested_carbon_credits:
      (project.invested_carbon_credits ?? 0) +
      (project.new_distribution_weight ?? 0) * carbonCreditsDemand,
  }));
};

const redistributePortfolio = (portfolio: Project[]): Project[] => {
  const overInvestedPortfolio = portfolio.filter(
    (project) =>
      (project.invested_carbon_credits ?? 0) > project.offered_volume_in_tons
  );

  const underInvestedPortfolio = portfolio.filter(
    (project) =>
      (project.invested_carbon_credits ?? 0) <= project.offered_volume_in_tons
  );

  const redistributionalCarbonCredits = calculateRedistrubtionalCarbonCredits(
    overInvestedPortfolio
  );

  const fullyInvestedProjects = overInvestedPortfolio.map((project) => ({
    ...project,
    invested_carbon_credits: project.offered_volume_in_tons,
  }));

  const irrelevantDistribution = calculateIrrelevantDistribution(
    overInvestedPortfolio
  );

  const restPortfolioWithNewDistributionWeight = newDistributionWeight(
    underInvestedPortfolio,
    irrelevantDistribution
  );

  const newPortfolio = newDistribution(
    redistributionalCarbonCredits,
    restPortfolioWithNewDistributionWeight
  );
  const finalPortfolio: Project[] = [...fullyInvestedProjects];

  if (
    newPortfolio.filter(
      (project) =>
        (project.invested_carbon_credits ?? 0) > project.offered_volume_in_tons
    ).length > 0
  ) {
    console.log("At least one project with tonnage more than offered volume");
    finalPortfolio.push(...redistributePortfolio(newPortfolio));
  } else {
    finalPortfolio.push(...newPortfolio);
  }

  return finalPortfolio;
};

const newDistributionWeight = (
  projects: Project[],
  reducedDistribution: number
) =>
  projects.map((project) => ({
    ...project,
    new_distribution_weight: project.distribution_weight / reducedDistribution,
  }));

const calculateRedistrubtionalCarbonCredits = (projects: Project[]) =>
  projects.reduce(
    (acc, project) =>
      acc +
      (project.invested_carbon_credits ?? 0) -
      project.offered_volume_in_tons,
    0
  );

export const calculateIrrelevantDistribution = (projects: Project[]) =>
  1 - projects.reduce((acc, project) => acc + project.distribution_weight, 0);

export const transformStringsToNumbers = (projects: ProjectRaw[]): Project[] =>
  projects.map((project) => ({
    ...project,
    price_per_ton: Number(project.price_per_ton),
    offered_volume_in_tons: Number(project.offered_volume_in_tons),
    distribution_weight: Number(project.distribution_weight),
  }));

export const finalCalculations = (projects: Project[]): Project[] => {
  let finalProjects = projects.map(
    (project): Project => ({
      ...project,
      invested_carbon_credits: Math.floor(project.invested_carbon_credits ?? 0),
    })
  );
  finalProjects = removePartialTons(finalProjects);
  finalProjects = calculatePricePerProject(finalProjects);

  finalProjects = calculateFinalDistribution(finalProjects);

  return finalProjects;
};

const removePartialTons = (projects: Project[]): Project[] =>
  projects.map((project) => ({
    ...project,
    invested_carbon_credits: Math.floor(project.invested_carbon_credits ?? 0),
  }));

const calculatePricePerProject = (projects: Project[]): Project[] =>
  projects.map((project) => ({
    ...project,
    total_price: (project.invested_carbon_credits ?? 0) * project.price_per_ton,
  }));

const calculateFinalDistribution = (projects: Project[]): Project[] => {
  const totalInvestedCarbonCredits = projects.reduce(
    (acc, project) => acc + (project.invested_carbon_credits ?? 0),
    0
  );
  return projects.map((project) => ({
    ...project,
    new_distribution_weight:
      (project.invested_carbon_credits ?? 0) / totalInvestedCarbonCredits,
  }));
};
