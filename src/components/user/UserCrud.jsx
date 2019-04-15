import React, { Component } from 'react'
import axios from 'axios'
import Main from '../template/Main'
const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de Motoristas: Incluir, Listar, Alterar e Excluir!'
}

var baseUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:3005/users' : 'http://www.truc:3005/users'
    
const initialState = {

user: { name: '',fone:'', birth_date: '', expires_at:'',cnh_number:'',doc_type:'',category:'',cpf_number:''},

    list: []
}

export default class UserCrud extends Component {

    state = { ...initialState }
    
    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }

    clear() {
        this.setState({ user: initialState.user })
    }

    save() {


        //tranformar em classe
        //veirifica os campos e seta msg de erros
        const user = this.state.user
        //Verifica se existe o id do usuario se tiver ele atualiza se não ele insere
        let nameError =  (user.name==='') ? 'Nome nao pode ser vazio': ''
        let telError =  (user.fone==='') ? 'Telefone não pode ser vazio': ''
        let birthError =  (user.birth_date==='') ? 'Data de Nascimento não pode ser vazio': ''
        let cnhError =  (user.cnh_number==='') ? 'Cnh não pode ser vazio': ''
        let cpfError =  (user.cpf_number==='') ? 'Cpf não pode ser vazio': ''
        let catError =  (user.category==='') ? 'Categoria não pode ser vazio': ''
        this.setState({  nameError, telError,birthError,cnhError,cpfError,catError});
          
       //verifica se todos os campos foram preenchidos
        if (user.name!=='' 
            && user.fone!==''
            && user.birth_date!=='' 
            && user.cnh_number!==''
            && user.cpf_number!==''
            && user.category!==''
            ){
      
            const method = user.id ? 'put' : 'post'
            const url = user.id ? `${baseUrl}/${user.id}` : baseUrl
            axios[method](url, user)
                .then(resp => {
                    //pega a lista de motoristas atualizada
                    const list = this.getUpdatedList(resp.data)
                    // Seta o estado para mostrar na
                    this.setState({ user: initialState.user, list })
             
                })
        }

    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if(add) list.unshift(user)
        return list
    }


    //UPDATE DO CAMPO

    updateField(event) {
        const user = { ...this.state.user }
         user[event.target.name] = event.target.value
        this.setState({ user })
    }

    renderForm() {
        return (
            <div className="form mt-5 rounded">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control" name="name" value={this.state.user.name} onChange={e=> this.updateField(e)}
                            placeholder="Digite o nome..." />
                                <div style={{ fontSize: 12, color: "red" }}>
                                    {this.state.nameError}
                                </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Telefone</label>
                            <input type="text" className="form-control" name="fone" value={this.state.user.fone} onChange={e=> this.updateField(e)}
                            placeholder="Digite Telefone." />
                           
                                <div style={{ fontSize: 12, color: "red" }}>
                                    {this.state.telError}
                                </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Data de nascimento</label>
                            <input type="text" className="form-control" name="birth_date" value={this.state.user.birth_date} onChange={e=> this.updateField(e)}
                            placeholder="Digite data de nascimento." />
                              <div style={{ fontSize: 12, color: "red" }}>
                                    {this.state.birthError}
                                </div>




                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>cpf</label>
                            <input type="text" className="form-control" name="cpf_number" value={this.state.user.cpf_number} onChange={e=> this.updateField(e)}
                            placeholder="Digite o numero do cpf." />
                             <div style={{ fontSize: 12, color: "red" }}>
                                    {this.state.cpfError}
                                </div>

                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>cnh</label>
                            <input type="text" className="form-control" name="cnh_number" value={this.state.user.cnh_number} onChange={e=> this.updateField(e)}
                            placeholder="Digite numero da cnh." />
                             <div style={{ fontSize: 12, color: "red" }}>
                                    {this.state.cnhError}
                                </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Categoria</label>
                            <input type="text" className="form-control" name="category" value={this.state.user.category} onChange={e=> this.updateField(e)}
                            placeholder="Digite a categoria." />
                              <div style={{ fontSize: 12, color: "red" }}>
                                    {this.state.catError}
                                </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <div className="p1">
                        <button className="btn btn-primary" onClick={e=> this.save(e)}>
                            Salvar
                        </button>
                        </div>
                        <div className="p1">
                        <button className="btn btn-secondary ml-2" onClick={e=> this.clear(e)}>
                            Cancelar
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    load(user) {
        this.setState({ user })
    }

    convertDate(timestamp=''){

    let res =null,
    dia=null,
    data=null
        if(timestamp.indexOf("-") !== -1){
            res = timestamp.split("-");
            dia = res[2].split('T')
            data = dia[0]+"/"+res[1]+"/"+res[0]
        }else{
            data = timestamp;
        }
        return data
    }


    remove(user) {
        axios.delete(`${baseUrl}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({ list })
        })
    }


    renderList() {
        return (
            <div className="col-md-12 ">
                Motoristas Cadastrados
            </div>     

        )
    }

    renderTable() {
        return (
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Data Nasc</th>
                        <th>Cpf</th>
                        <th>Cnh</th>
                        <th>Categoria</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }


    renderRows() {
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.fone}</td>
                    <td>{this.convertDate(user.birth_date)}</td>
                    <td>{user.cpf_number}</td>
                    <td>{user.cnh_number}</td>
                    <td>{user.category}</td>
                  <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button>
              
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                   </td>
                   
                </tr>
            )
        })
    }
    
    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                <div className="col-md-12 spacer mt-2 rounded">
                    {this.renderList()}
                  </div>     
                <div className="col-md-12 spacer mt-2 rounded">
                 {this.renderTable()}
                </div>
            </Main>
        )
    }
}