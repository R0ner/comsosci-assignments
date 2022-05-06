import { FC, useState, useRef } from 'react';
import styles from './WordcloudSection.module.scss';
import untypedTFIDF from '../../department_tfidf_scores.json';

import Select from 'react-select'

var Latex = require('react-latex');
var cloud = require('d3-cloud');
var d3 = require('d3');


interface SelectOption {
  value: string,
  label: string
}


// Define JSON data structure
interface Datum {
  text: string;
  size: number;
}

interface MapType {
  [id: string]: Datum[];
}

// Cast JSON data to the defined type
const TFIDF: MapType = untypedTFIDF;

const departments: SelectOption[] = Object.entries(TFIDF).map((k, v) => ({ value: k[0], label: k[0] }))

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 2; i++) {
    color += letters[Math.floor(Math.random() * 4)];
  }
  for (var i = 0; i < 2; i++) {
    color += letters[Math.floor(Math.random() * 4)];
  }
  for (var i = 0; i < 2; i++) {
    color += letters[Math.floor(Math.random() * 8 + 8)];
  }

  return color;
}

interface WordcloudSectionProps { }

const WordcloudSection: FC<WordcloudSectionProps> = () => {

  const [selOption, setSelOption] = useState(departments[0]);
  const [cloudWords, setCloudWords] = useState(TFIDF[selOption.value]);

  // Probably would be better to use refs
  //const cloudRef = useRef<HTMLDivElement>();

  const HandleChange = (obj: any) => {
    setSelOption(obj);
    setCloudWords(TFIDF[obj.value]);
  };

  function onMounted(div: any) {
    if (!div) {
      return false;
    }

    var layout = cloud()
      .size([div.offsetWidth, Math.floor(div.offsetWidth * 9 / 16)])
      .words(cloudWords)
      .padding(5)
      .rotate(function () { return Math.floor(Math.random() * 3 - 1) * 30; })
      .font("Neo Sans")
      .fontSize(function (d: any) { return d.size * 40 + 10; })
      .on("end", draw);

    function draw(words: any) {
      d3.select("#cloud").remove()
      d3.select("#wordcloud").append("svg")
        .attr("id", "cloud")
        .attr("width", layout.size()[0])
        .attr("height", layout.size()[1])
        .append("g")
        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function (d: any) { return d.size + "px"; })
        .style("font-family", "Neo Sans")
        .style("fill", function (d: any) { return getRandomColor(); })
        .attr("text-anchor", "middle")
        .attr("transform", function (d: any) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d: any) { return d.text; });
    }

    layout.start();

    return true;
  }


  return (

    <div className={styles.WordcloudSection}>
      <h1>Departments as the sum of their courses</h1>
      <div className='wrapper'>
        <div>
          <p>
            From a students perspective, the defining factor of a department is its courses.
            To see which topics are covered by the courses of each department, we've concatenated
            course names and descriptions and performed a <a href="https://en.wikipedia.org/wiki/Tf%E2%80%93idf">TF-IDF</a> analysis.
            In such an analysis, each word is weighted by the following formula:
          </p>
          <Latex displayMode={true}>{"$$\\text{tf-idf}(t, d) = tf(t, d) \\cdot idf(t)$$"}</Latex>
          <p>
            The score is proportional to its frequency in the document (tf), and inversely
            proportional to the frequency in the entire corpus (idf). Mathematically, the terms are defined
            as follows:
          </p>
          <Latex displayMode={true}>{"$$tf(t, d) = \\frac{count(t, d)}{\\sum_{t'} count(t', d)}$$"}</Latex>
          <Latex displayMode={true}>{"$$idf(t) = \\log \\frac{|D|}{|{d \\in D : t \\in d}|}$$"}</Latex>
          <p>Where t is a term, d is a document, and D is the entire corpus.</p>
          Using the scored terms, we have visualized the topics in each department in wordclouds. We hope that you find them as 
          interesting as we do!

        </div>
        <div className='wordcloud-column'>
          <Select
            className='select'
            options={departments}
            value={selOption}
            onChange={(option) => HandleChange(option)} />

          <div id="wordcloud" ref={(div) => onMounted(div)}></div>
        </div>

      </div>
    </div>
  )
};


export default WordcloudSection;
