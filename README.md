# PayPulse

PayPulse is a secure, React-based web application that facilitates user-to-user payment transactions. It allows users to sign up, log in, add funds via credit card, and view detailed transaction logs. This application integrates advanced security features such as JWT authentication and password hashing to ensure user data protection.

## Features

- **User Authentication**: Implements JWT for secure authentication and bcrypt for password hashing.
- **Stripe Integration**: Allows users to securely add money to their wallets using their credit cards.
- **Data Storage**: Utilizes MongoDB, a NoSQL database, to store user data and transaction details.
- **Transaction Visualization**: Employs ReactJS charts to visually represent user transactions, helping users easily understand their spending patterns.
- **Transaction Log**: Provides a comprehensive log of user transactions with a feature to lock transactions after five unsuccessful retries.

## Technologies Used

- **Frontend**: React.js, ReactJS Charts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Processing**: Stripe

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to have Node.js and npm installed on your machine. To install these, you can follow the instructions from [Node.js official website](https://nodejs.org/).

### Installation

1. Clone the repository:
git clone https://github.com/yourusername/paypulse.git
2. Navigate to the project directory:
cd PayPulse
3. Install NPM packages:
npm install
4. Set up the environment variables:
Create a `.env` file in the root directory and add the following:
DATABASE_URI=your_mongodb_uri STRIPE_KEY=your_stripe_secret_key JWT_SECRET=your_jwt_secret
5. Start the server:

## Usage

Once the server is running, open your web browser and navigate to `http://localhost:3000` to view the application. You can sign up for a new account or log in to access the payment functionalities.

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgments

- Thanks to all the contributors who invest their time into helping improve and extend the functionality of PayPulse.
- Special thanks to the Stripe and MongoDB communities for their support and powerful technologies.
