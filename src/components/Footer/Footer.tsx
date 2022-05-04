import React, { FC } from 'react';
import styles from './Footer.module.scss';

interface FooterProps { }

const Footer: FC<FooterProps> = () => (
  <div className={styles.Footer}>
    <div>
      Created by:
      <br />
      <br />
      Rune Henrik Verder Sehested
      <br />
      Anton Thestrup Jørgensen
    </div>
    <div>
      <br />
      <br />
      s191510
      <br />
      s194268
    </div>
    <div>
      <br />
      02467
      <br />
      Computational Social Science
      <br />
      Technical University of Denmark
    </div>
  </div>
);

export default Footer;
