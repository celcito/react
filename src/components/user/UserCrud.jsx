import React, { Component } from 'react'
import axios from 'axios'
import InputMask from 'react-input-mask';
import Main from '../template/Main'
//import MaterialInput from '@material-ui/core/Input';
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
var typeMethod=''
var sucess=''
//var confirm=''

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
        let cpfError =  this.validarCPF( user.cpf_number ) ? '': 'Cpf invalido'
        let catError =  (user.category==='') ? 'Categoria não pode ser vazio': ''
        this.setState({  nameError, telError,birthError,cnhError,cpfError,catError,sucess,typeMethod});
          
       //verifica se todos os campos foram preenchidos
        if (user.name!=='' 
            && user.fone!==''
            && user.birth_date!=='' 
            && user.cnh_number!==''
            && user.cpf_number!==''
            && this.validarCPF( user.cpf_number )!==false
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
                    sucess=true
                    typeMethod = (method ==='post') ? 'Cadastrado' : 'Alterado'
                    this.setState({typeMethod,sucess});

                    //depois de 3 segundos seta o state para remover o aviso
                    setTimeout(() => {
                          sucess=false
                          typeMethod=''   
                          this.setState({ sucess,typeMethod});
                    }, 3000);
                 
                   }).catch(function (error) {
                         console.log(error);
                    });
        }

    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if(add) list.unshift(user)
        return list
    }

    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

    renderNotice()   {     
        if (this.state.sucess && this.state.sucess!==''){
            return (
                <div id="sucesso" className=" col-md-12  col-md-12 spacer mt-2  rounded pt-4 ">{this.state.typeMethod}  com sucesso</div>
            )
        }
        //else if (this.state.sucess==='' && this.state.sucess!==true){
        //     return (
        //              <div id="teste" className=" col-md-12  col-md-12 spacer mt-2  rounded pt-4 ">{this.state.typeMethod} Erro contate o suporte</div>
        //     )
        // }
    }


     renderConfirm()   {     
        if (this.state.confirm!=='' & this.state.confirm===false ){
            return (
                <div id="aviso" className="col-md-12 spacer mt-2  rounded pt-4 ">{this.state.typeMethod} Deseja Realmente Excluir este Motorista!
                <button type="button" className="btn btn-info" onClick={() => this.remove(this.state.userDelete,true)}>OK</button>
                </div>
            )
        }
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
                             <InputMask  className="form-control"  value={this.state.user.fone} placeholder="Digite Telefone." name="fone" mask="(99)9999-9999" onChange={e=> this.updateField(e)} />

                    <div style={{ fontSize: 12, color: "red" }}>
                                    {this.state.telError}
                                </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Data de nascimento</label>
                             <InputMask  className="form-control"  value={this.state.user.birth_date}   placeholder="Digite data de nascimento." name="birth_date"  mask="99/99/9999" onChange={e=> this.updateField(e)} />
                              <div style={{ fontSize: 12, color: "red" }}>
                                    {this.state.birthError}
                                </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>cpf</label>
                    <InputMask  className="form-control"  value={ this.state.user.cpf_number}placeholder="Digite o numero do cpf."  name="cpf_number" mask="999.999.999-99" onChange={e=> this.updateField(e)} />

                             <div style={{ fontSize: 12, color: "red" }}>
                                    {this.state.cpfError}
                                </div>

                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>cnh</label>
                            <InputMask  className="form-control"  value={this.state.user.cnh_number}  placeholder="Digite data de nascimento." name="cnh_number"  mask="999999999999999" onChange={e=> this.updateField(e)} />

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
        typeMethod='Alterado'
        this.setState({typeMethod});
    }



     validarCPF(cpf) {  
            cpf = cpf.replace(/[^\d]+/g,'');    
            if(cpf === '') return false; 
            // Elimina CPFs invalidos conhecidos    
            if (cpf.length !== 11 || 
                cpf === "00000000000" || 
                cpf === "11111111111" || 
                cpf === "22222222222" || 
                cpf === "33333333333" || 
                cpf === "44444444444" || 
                cpf === "55555555555" || 
                cpf === "66666666666" || 
                cpf === "77777777777" || 
                cpf === "88888888888" || 
                cpf === "99999999999")
                    return false;       
            // Valida 1o digito 
           var add = 0;    
            for (var i=0; i < 9; i ++)      
                add += Number(cpf.charAt(i)) * (10 - i);  
              var  rev = 11 - (add % 11);  
                if (rev === 10 || rev === 11)     
                    rev = 0;    
                if (rev !== Number(cpf.charAt(9)))     
                    return false;       
            // Valida 2o digito 
            add = 0;    
            for ( i = 0; i < 10; i ++)       
                add += Number(cpf.charAt(i)) * (11 - i);  
           rev = 11 - (add % 11);  
            if (rev === 10 || rev === 11) 
                rev = 0;    
            if (rev !== Number(cpf.charAt(10)))
                return false;       
            return true;   
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


    remove(user,confirm =false) {

        this.setState({confirm});
        let userDelete = user
        if (confirm) {
               axios.delete(`${baseUrl}/${userDelete.id}`).then(resp => {
                const list = this.getUpdatedList(user, false)
                this.setState({ list })
                    typeMethod='Deletado'
                    sucess=true
                    confirm=true
                this.setState({typeMethod,sucess,confirm});
                this.setState({sucess});

                setTimeout(() => {
                     sucess=false   
                     this.setState({ sucess });
                    }, 3000);
                 }).catch(function (error) {
                         console.log(error);
                 });
        }else{
            this.setState({userDelete});
        }
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
                    <td>{ user.cpf_number}</td>
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
                {this.renderNotice()}
                {this.renderConfirm()}
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