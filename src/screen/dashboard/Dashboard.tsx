import React from 'react';
import Loader from '../../components/Loader';
import { Box, Card, CardContent, Grid } from '@mui/material';

import ChartOne from './widgets/ChartOne';
import ChartTwo from './widgets/ChartTwo';
import ChartThree from './widgets/ChartThree';
import Diversity2Icon from '@mui/icons-material/Diversity2';

type Props = {};

const Dashboard = (props: Props) => {
   const cardsData = [
     {
       id: 1,
       title: 'Active Leads',
       content: '40',
       color: 'green'
     },
     {
       id: 2,
       title: 'Converted Leads',
       content: '10',
       color: 'blue'
     },
     {
       id: 3,
       title: 'Lead Closed',
       content: '10',
       color: 'red'
     },
     {
       id: 4,
       title: 'Lead Pending',
       content: '10',
       color: 'violet'
     },
     {
       id: 5,
       title: 'Today Task Leads',
       content: '50',
       color: 'pink'
     }
     // ... add more card data if needed
   ];

    const cardsDataBottom = [
     {
       id: 1,
       title: 'Contacted',
       content: '40',
       color: 'green'
     },
     {
       id: 2,
       title: 'Orientation',
       content: '10',
       color: 'blue'
     },
     {
       id: 3,
       title: 'Nurturing',
       content: '10',
       color: 'red'
     },
     {
       id: 4,
       title: 'Working',
       content: '10',
       color: 'violet'
     },
     {
       id: 5,
       title: 'Total',
       content: '50',
       color: 'pink'
     }
     // ... add more card data if needed
   ];
  return (
    <div>
      <Grid container spacing={1}>
        {cardsData.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={2} lg={3} xl={2.4}>
            <Card>
              <CardContent
                style={{
                  borderTop: `2px solid ${card.color}`,
                  borderRadius: '10px',
                  padding: '8px'
                }}
              >
                <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '20px' }}>{card.content}</p>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        {' '}
        {/* Grid for charts */}
        <Grid item xs={12} sm={4}>
          <ChartOne />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ChartTwo />
        </Grid>
        <Grid item xs={12} sm={4}>
          <ChartThree />
        </Grid>
      </Grid>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2
          style={{ fontSize: '30px', fontWeight: 'bold', marginRight: '20px' }}
        >
          {' '}
          <Diversity2Icon />
          Stage Wise Patient in Pipeline
        </h2>
        <h2 style={{ fontSize: '30px', fontWeight: 'bold' ,marginLeft:'180px'}}>
          {' '}
          <Diversity2Icon />
          Stage Wise Value in Pipeline
        </h2>
      </div>
      <Grid container spacing={1}>
        {cardsDataBottom.map((card) => (
          <Grid item key={card.id} xs={12} sm={6} md={2} lg={3} xl={1.1}>
            <Card>
              <CardContent
                style={{
                  borderRadius: '10px',
                  padding: '8px'
                }}
              >
                <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '20px' }}>{card.content}</p>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={2} lg={3} xl={1.1}>
          <Card>
            <CardContent
              style={{
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Nurturing
              </h3>
              <p style={{ fontSize: '20px' }}>2.5L</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={3} xl={1.1}>
          <Card>
            <CardContent
              style={{
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Orientation
              </h3>
              <p style={{ fontSize: '20px' }}>2.5L</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={3} xl={1.1}>
          <Card>
            <CardContent
              style={{
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Working</h3>
              <p style={{ fontSize: '20px' }}>2.5L</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={3} xl={1.1}>
          <Card>
            <CardContent
              style={{
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>RFA</h3>
              <p style={{ fontSize: '20px' }}>2.5L</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={3} xl={1.1}>
          <Card>
            <CardContent
              style={{
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Contacted
              </h3>
              <p style={{ fontSize: '20px' }}>2.5L</p>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2} lg={3} xl={1}>
          <Card>
            <CardContent
              style={{
                borderRadius: '10px',
                padding: '8px'
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                Lost Lead
              </h3>
              <p style={{ fontSize: '20px' }}>2.5L</p>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
