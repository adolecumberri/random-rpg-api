const APELLIDOS = require("../jsons/commun/apellidos");

const createCrewsByEvent: (eventType: number) => string = (eventType) => {
  let result = "";
  switch (eventType) {
    case 1: //Hombre vs mujeres. 153 vs 153
      result = event1();
      break;
  }

  return result;
};

const event1: () => string = () => {
  let crewHombres: string[] = [];
  let crewMujeres: string[] = [];

  APELLIDOS.forEach((apellido: string) => {
    crewHombres.push(`LOS ${apellido}`);
    crewMujeres.push(`LAS ${apellido}`);
  });
  let crews = crewHombres.concat(crewMujeres);

  let query = `INSERT INTO crew VALUES `;
  crews.forEach((newValue: string, i: number) => {
 
    query += `(NULL, "${newValue}", 1, ${newValue.includes("LOS") ? '"MALE"' : '"FEMALE"'}, 1)`;

    if (i !== crews.length - 1) {
        query += ",";
      }else{
          query += ";";
      }
  });

  return query;
};

export { createCrewsByEvent };
