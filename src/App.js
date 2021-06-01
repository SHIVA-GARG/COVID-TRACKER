import React, { useEffect, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Avatar,
} from "@material-ui/core";
import "./App.css";
import InfoBoxes from "./InfoBoxes";
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from "./LineGraph";
// import Map from "./Map";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldWide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetch("https://api.caw.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => setCountryInfo(data));
  }, []);

  useEffect(() => {
    const getData = async () => {
      await fetch("https://api.caw.sh/v3/covid-19/countries")
        .then((res) => res.json())
        .then((data) => {
          const countries = data.map((country, index) => ({
            name: country.country,
            value: country.countryInfo.iso2,
            flag: country.countryInfo.flag,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };

    getData();

    // return;
  }, []);

  const onCOuntryChange = async (event) => {
    const countryCode = event.target.value;
    const URL =
      countryCode === "worldWide"
        ? "https://api.caw.sh/v3/covid-19/all"
        : `https://api.caw.sh/v3/covid-19/countries/${countryCode}/?strict=true`;

    await fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };
  // console.log(countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1> COVID-19 TRACKER</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCOuntryChange}
            >
              <MenuItem value="worldWide">WorldWide</MenuItem>

              {countries.map((country, index) => (
                <MenuItem
                  className="menuItem"
                  value={country.value}
                  key={index}
                >
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* {console.log(countryInfo)} */}
        <div className="app__stats">
          <InfoBoxes
            title="Coronavirus Cases"
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          />
          <InfoBoxes
            title="Recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          />
          <InfoBoxes
            title="Deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          />
        </div>

        {/* world wide map */}
//         <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By country</h3>
          <Table countries={tableData} />
          <h3>WorldWode new cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
