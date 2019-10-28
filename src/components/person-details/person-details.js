import React, { Component } from 'react';

import './person-details.css';
import SwapiService from "../../services/swapi-service";
import Spinner from "../spinner";

export default class PersonDetails extends Component {

    swapiService = new SwapiService();

    state = {
        person: null,
        loading: true
    };

    componentDidMount() {
        this.interval = setInterval(this.updatePerson, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.personId !== prevProps.personId) {
            this.updatePerson();
        }
    }

    onPersonLoaded = (person) => {
        this.setState({
            person,
            loading: false
        });
    };

    updatePerson() {
        const { personId } = this.props;
        if (!personId) {
            return;
        }

        this.swapiService
            .getPerson(personId)
            .then((person) => this.onPersonLoaded(person));
    }

    render() {

        if (!this.state.person) {
            return <span>Select a person from a list</span>;
        }

        const { person, loading } = this.state;
        const spinner = loading ? <Spinner /> : null;
        const content = !loading ? <PersonView person={person}/> : null;

        return (
            <div className="person-details card">
                {spinner}
                {content}
            </div>
        )
    }
}

const PersonView = ({ person }) => {
    const { id, name, gender, birthYear, eyeColor } = person;

    return (
        // React Fragment - это специальный элемент обвертки, который нужен исключительно, чтобы сгруппировать другие элементы не создавая лишних DOM объектов,
        // по сколько из ф-ции render, мы можем вернуть только один элемент.
        <React.Fragment>
            <img className="person-image"
                 src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`} alt="character"/>

            <div className="card-body">
                <h4>{name} {id}</h4>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <span className="term">Gender</span>
                        <span>{gender}</span>
                    </li>
                    <li className="list-group-item">
                        <span className="term">Birth Year</span>
                        <span>{birthYear}</span>
                    </li>
                    <li className="list-group-item">
                        <span className="term">Eye Color</span>
                        <span>{eyeColor}</span>
                    </li>
                </ul>
            </div>
        </React.Fragment>
    );
};