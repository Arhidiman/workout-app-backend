const testDecorator = (target: Test, a: any ) => {
    console.log(target)
    console.log(a)
    // console.log(b)
}


const paramDecorator = (
    target: Object,
    propertyKey: any,
    parameterIndex: any
) => {
    console.log(target)
    console.log(propertyKey)
    console.log(parameterIndex)

}



class Test {
    name: string = 'g'
    prop: string

    constructor(@paramDecorator prop) {
        this.name = 'Test calss'
        this.prop = prop
    }

    test( param) {
        console.log(param)
    }
}

const t = new Test('ljllk')

t.test('lololo')

