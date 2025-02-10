import { Project } from "../../../../server/types/types";
import cls from "classnames";
import styles from "./card.module.scss";

const Card = ({ project }: { project: Project }) => {
  return (
    <div className="card shadow-sm rounded-top">
      <img
        src={project.image}
        alt={project.name}
        className={cls("rounded-top", styles.image)}
      />
      <div className="card-body">
        <h3>{project.name}</h3>
        <p className={cls("card-text", styles.lineClamp)}>
          {project.description}
        </p>
        <div className={styles.list}>
          <p>Total Credits: </p>
          <p> {project.invested_carbon_credits} tons</p>
        </div>
        <div className={styles.list}>
          <p>Total costs: </p>
          <p> {project.total_price} US$</p>
        </div>
        <div className={styles.list}>
          <p>Project share in portfolio: </p>
          <p>
            {Math.round(
              ((project.new_distribution_weight ?? 0) + Number.EPSILON) * 100
            )}
            %
          </p>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          {/* TODO: add link to project detail page */}
          <button className="btn btn-primary my-2" type="submit">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
