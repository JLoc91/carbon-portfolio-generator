"use client";

import { useState } from "react";
import Header from "@/components/header/header";
import { Project } from "../../../server/types/types";
import Card from "@/components/card/card";
import styles from "./page.module.scss";
import cls from "classnames";

type PostResponse = {
  success: boolean;
  carbonCreditsDemand: number;
  portfolio: Project[];
};

export default function Home() {
  const [formData, setFormData] = useState<string>("");
  const [portfolio, setPortfolio] = useState<PostResponse | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = { carbonCreditsDemand: parseInt(formData, 10) };

    try {
      const response = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setPortfolio(result);
      console.log("Success:", result);
    } catch (error) {
      console.log(error);

      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Header />
      <main className="container">
        <section className="py-5 text-center">
          <div className="row py-lg-5">
            <div className="col-lg-6 col-md-8 mx-auto">
              <h1 className="fw-light">Carbon offsetting Projects</h1>
              <p className="lead text-muted">
                Carbon offsetting by investing in climate projects means funding
                renewable energy, reforestation, or other initiatives that
                reduce greenhouse gas emissions. Get involved and make a real
                difference in reducing the carbon footprint!
              </p>
              <form
                onSubmit={handleSubmit}
                className={cls("form-text", styles.form)}
              >
                <label className="text-muted fst-italic form-label ">
                  Enter your desired carbon credits demand (in full tons):
                  <input
                    type="number"
                    min="0"
                    value={formData}
                    onChange={handleChange}
                    required
                    className="ps-2"
                  />
                </label>
                <button
                  className="btn btn-primary my-2 w-25 align-middle"
                  type="submit"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </section>
        {portfolio && (
          <section className="album py-5 bg-light">
            <div className="container">
              <h2 className="fw-light">{`Portfolio for carbon credits of ${portfolio.carbonCreditsDemand} tons`}</h2>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {portfolio.portfolio.map((project, index) => (
                  <div className="col" key={index}>
                    <Card project={project} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
